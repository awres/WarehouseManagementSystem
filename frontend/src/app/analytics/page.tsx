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
import { ThemeToggle } from "@/components/theme-toggle";

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
    <div className="flex min-h-screen w-full flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span>WarehouseOS</span>
        </div>
        <nav className="hidden flex-1 items-center gap-6 text-sm md:flex">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground/80"
          >
            Dashboard
          </Link>
          <Link
            href="/inventory"
            className="text-muted-foreground transition-colors hover:text-foreground/80"
          >
            Inventory
          </Link>
          <Link
            href="/orders"
            className="text-muted-foreground transition-colors hover:text-foreground/80"
          >
            Orders
          </Link>
          <Link
            href="/customers"
            className="text-muted-foreground transition-colors hover:text-foreground/80"
          >
            Customers
          </Link>
          <Link
            href="/returns"
            className="text-muted-foreground transition-colors hover:text-foreground/80"
          >
            Returns
          </Link>
          <Link
            href="/analytics"
            className="font-medium transition-colors hover:text-foreground/80"
          >
            Analytics
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/settings">Settings</Link>
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <nav className="grid gap-2 p-4 text-sm">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/inventory"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Package className="h-4 w-4" />
              Inventory
            </Link>
            <Link
              href="/orders"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <ClipboardList className="h-4 w-4" />
              Orders
            </Link>
            <Link
              href="/customers"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Truck className="h-4 w-4" />
              Customers
            </Link>
            <Link
              href="/returns"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <RefreshCcw className="h-4 w-4" />
              Returns
            </Link>
            <Link
              href="/analytics"
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
            >
              <LineChart className="h-4 w-4" />
              Analytics
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">
                  Insights and performance metrics
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={
                    selectedTimeframe === "7days" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedTimeframe("7days")}
                >
                  7 days
                </Button>
                <Button
                  variant={
                    selectedTimeframe === "30days" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedTimeframe("30days")}
                >
                  30 days
                </Button>
                <Button
                  variant={
                    selectedTimeframe === "90days" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedTimeframe("90days")}
                >
                  90 days
                </Button>
                <Button
                  variant={selectedTimeframe === "year" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeframe("year")}
                >
                  Year
                </Button>
              </div>
            </div>

            {error ? (
              <div className="p-4 text-destructive bg-destructive/10 rounded-lg">
                {error}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Total Sales</CardTitle>
                    <CardDescription>For the selected period</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {loading ? (
                      <div className="animate-pulse h-8 bg-muted rounded"></div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">
                          $
                          {summary.totalSales.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
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
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>For the selected period</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {loading ? (
                      <div className="animate-pulse h-8 bg-muted rounded"></div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">
                          {summary.orderCount}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
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
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Returns</CardTitle>
                    <CardDescription>For the selected period</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {loading ? (
                      <div className="animate-pulse h-8 bg-muted rounded"></div>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">
                          {summary.returnCount}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
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
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Sales Over Time</CardTitle>
                  <CardDescription>
                    Track your sales performance over the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <SalesOverTimeChart timeframe={selectedTimeframe} />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Price Change Impact</CardTitle>
                  <CardDescription>
                    See how price changes affect product sales
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
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
