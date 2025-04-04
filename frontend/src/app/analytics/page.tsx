"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  ClipboardList,
  LineChart,
  Package,
  RefreshCcw,
  Settings,
  Truck,
} from "lucide-react";

import { getAnalyticsSummary } from "@/lib/api";
import { PriceChangeImpactChart } from "@/components/price-change-impact-chart";
import { SalesOverTimeChart } from "@/components/sales-over-time-chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7days");
  const [summary, setSummary] = useState({
    totalSales: 0,
    orderCount: 0,
    returnCount: 0,
    salesGrowth: 0,
    orderGrowth: 0,
    returnGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await getAnalyticsSummary(selectedTimeframe);
        setSummary(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics summary:", err);
        setError("Failed to load analytics summary. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [selectedTimeframe]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#141414]">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-800 bg-[#1a1a1a] px-6">
        <div className="flex items-center gap-2 font-semibold text-white">
          <Package className="h-6 w-6" />
          <span>WarehouseOS</span>
        </div>
        <nav className="hidden flex-1 items-center gap-6 text-sm md:flex">
          <Link href="/" className="text-gray-400 hover:text-gray-200">
            Dashboard
          </Link>
          <Link href="/inventory" className="text-gray-400 hover:text-gray-200">
            Inventory
          </Link>
          <Link href="/orders" className="text-gray-400 hover:text-gray-200">
            Orders
          </Link>
          <Link href="/customers" className="text-gray-400 hover:text-gray-200">
            Customers
          </Link>
          <Link href="/returns" className="text-gray-400 hover:text-gray-200">
            Returns
          </Link>
          <Link href="/analytics" className="text-gray-200 font-medium">
            Analytics
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/settings">Settings</Link>
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-gray-800 bg-[#1a1a1a] md:block">
          <nav className="grid gap-1 p-4 text-sm">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 hover:text-gray-200"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/inventory"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 hover:text-gray-200"
            >
              <Package className="h-4 w-4" />
              Inventory
            </Link>
            <Link
              href="/orders"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 hover:text-gray-200"
            >
              <ClipboardList className="h-4 w-4" />
              Orders
            </Link>
            <Link
              href="/customers"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 hover:text-gray-200"
            >
              <Truck className="h-4 w-4" />
              Customers
            </Link>
            <Link
              href="/returns"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 hover:text-gray-200"
            >
              <RefreshCcw className="h-4 w-4" />
              Returns
            </Link>
            <Link
              href="/analytics"
              className="flex items-center gap-3 rounded-lg bg-gray-200 px-3 py-2 text-gray-900"
            >
              <LineChart className="h-4 w-4" />
              Analytics
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-[#141414] text-white">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">Analytics</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTimeframe("7days")}
                  className={`px-4 py-1 rounded-md ${
                    selectedTimeframe === "7days"
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-300 hover:bg-[#252525]"
                  }`}
                >
                  7 days
                </button>
                <button
                  onClick={() => setSelectedTimeframe("30days")}
                  className={`px-4 py-1 rounded-md ${
                    selectedTimeframe === "30days"
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-300 hover:bg-[#252525]"
                  }`}
                >
                  30 days
                </button>
                <button
                  onClick={() => setSelectedTimeframe("90days")}
                  className={`px-4 py-1 rounded-md ${
                    selectedTimeframe === "90days"
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-300 hover:bg-[#252525]"
                  }`}
                >
                  90 days
                </button>
                <button
                  onClick={() => setSelectedTimeframe("year")}
                  className={`px-4 py-1 rounded-md ${
                    selectedTimeframe === "year"
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-300 hover:bg-[#252525]"
                  }`}
                >
                  Year
                </button>
              </div>
            </div>

            {error ? (
              <div className="p-4 text-red-400 bg-red-900/30 rounded-lg">
                {error}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="rounded-md overflow-hidden border-0 bg-[#1a1a1a] text-white">
                  <CardHeader className="pb-2 bg-[#1a1a1a] text-white border-b border-gray-800">
                    <CardTitle>Total Sales</CardTitle>
                    <CardDescription className="text-gray-400">
                      For the selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 bg-[#1a1a1a]">
                    {loading ? (
                      <div className="animate-pulse h-8 bg-gray-800 rounded"></div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-white">
                          $
                          {summary.totalSales.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          <span
                            className={`font-medium ${
                              summary.salesGrowth >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {summary.salesGrowth >= 0 ? "↑" : "↓"}{" "}
                            {Math.abs(summary.salesGrowth).toFixed(1)}%
                          </span>{" "}
                          from previous period
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card className="rounded-md overflow-hidden border-0 bg-[#1a1a1a] text-white">
                  <CardHeader className="pb-2 bg-[#1a1a1a] text-white border-b border-gray-800">
                    <CardTitle>Orders</CardTitle>
                    <CardDescription className="text-gray-400">
                      For the selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 bg-[#1a1a1a]">
                    {loading ? (
                      <div className="animate-pulse h-8 bg-gray-800 rounded"></div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-white">
                          {summary.orderCount}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          <span
                            className={`font-medium ${
                              summary.orderGrowth >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {summary.orderGrowth >= 0 ? "↑" : "↓"}{" "}
                            {Math.abs(summary.orderGrowth).toFixed(1)}%
                          </span>{" "}
                          from previous period
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card className="rounded-md overflow-hidden border-0 bg-[#1a1a1a] text-white">
                  <CardHeader className="pb-2 bg-[#1a1a1a] text-white border-b border-gray-800">
                    <CardTitle>Returns</CardTitle>
                    <CardDescription className="text-gray-400">
                      For the selected period
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 bg-[#1a1a1a]">
                    {loading ? (
                      <div className="animate-pulse h-8 bg-gray-800 rounded"></div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-white">
                          {summary.returnCount}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          <span
                            className={`font-medium ${
                              summary.returnGrowth <= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {summary.returnGrowth <= 0 ? "↓" : "↑"}{" "}
                            {Math.abs(summary.returnGrowth).toFixed(1)}%
                          </span>{" "}
                          from previous period
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-1 md:col-span-2 rounded-md overflow-hidden border-0 bg-[#1a1a1a] text-white">
                <CardHeader className="bg-[#1a1a1a] text-white border-b border-gray-800">
                  <CardTitle>Sales Over Time</CardTitle>
                  <CardDescription className="text-gray-400">
                    Track your sales performance over the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 bg-[#1a1a1a]">
                  <SalesOverTimeChart timeframe={selectedTimeframe} />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="rounded-md overflow-hidden border-0 bg-[#1a1a1a] text-white">
                <CardHeader className="bg-[#1a1a1a] text-white border-b border-gray-800">
                  <CardTitle>Price Change Impact</CardTitle>
                  <CardDescription className="text-gray-400">
                    See how price changes affect product sales
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 bg-[#1a1a1a]">
                  <PriceChangeImpactChart />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
