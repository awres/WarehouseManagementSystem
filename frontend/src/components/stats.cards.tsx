"use client";

import {
  Package,
  ShoppingCart,
  AlertTriangle,
  TrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "lucide-react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCards() {
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [pendingOrders, setPendingOrders] = useState<number | null>(null);
  const [lowStockCount, setLowStockCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:8000/get/products/"),
          axios.get("http://localhost:8000/get/orders/"),
        ]);

        setTotalProducts(productsRes.data.length);
        const lowStockProducts = productsRes.data.filter(
          (product: { stock_quantity: number }) => product.stock_quantity <= 10
        );
        setLowStockCount(lowStockProducts.length);

        // Orders
        const pendingCount = ordersRes.data.filter(
          (order: { status: string }) => order.status === "PENDING"
        ).length;
        setPendingOrders(pendingCount);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const MotionCard = motion(Card);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Counter animation for numbers
  const Counter = ({
    value,
    className,
  }: {
    value: number;
    className?: string;
  }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const end = value;
      const duration = 1500;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [value]);

    return <span className={className}>{count}</span>;
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="border-0 shadow-md bg-card/50 backdrop-blur-sm overflow-hidden"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-1">
        <Card className="border-0 shadow-md bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center gap-2">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <MotionCard
        variants={cardVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 overflow-hidden"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Total Inventory
          </CardTitle>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50">
            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              {totalProducts !== null ? <Counter value={totalProducts} /> : 0}
            </div>
            <div className="ml-2 flex items-center text-xs font-medium text-blue-500 dark:text-blue-400">
              <TrendingUpIcon className="h-3.5 w-3.5 mr-1" />
              <span>Total</span>
            </div>
          </div>
          <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
            items in stock
          </p>

          <div className="mt-4 h-1.5 w-full bg-blue-100 dark:bg-blue-900/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </CardContent>
      </MotionCard>

      <MotionCard
        variants={cardVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 overflow-hidden"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">
            Pending Orders
          </CardTitle>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50">
            <ShoppingCart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">
              {pendingOrders !== null ? <Counter value={pendingOrders} /> : 0}
            </div>
            <div
              className={cn(
                "ml-2 flex items-center text-xs font-medium",
                pendingOrders && pendingOrders > 5
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-green-600 dark:text-green-400"
              )}
            >
              {pendingOrders && pendingOrders > 5 ? (
                <ArrowUpIcon className="h-3.5 w-3.5 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3.5 w-3.5 mr-1" />
              )}
              <span>{pendingOrders && pendingOrders > 5 ? "High" : "Low"}</span>
            </div>
          </div>
          <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
            awaiting fulfillment
          </p>

          <div className="mt-4 h-1.5 w-full bg-amber-100 dark:bg-amber-900/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: pendingOrders
                  ? `${Math.min((pendingOrders / 20) * 100, 100)}%`
                  : "0%",
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </CardContent>
      </MotionCard>

      <MotionCard
        variants={cardVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="border-0 shadow-lg bg-gradient-to-br from-red-200/50 to-red-300/50 dark:from-red-500/40 dark:to-red-600/40 overflow-hidden"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-950 dark:text-red-200">
            Low Stock Alerts
          </CardTitle>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-300 dark:bg-red-700/50">
            <AlertTriangle className="h-5 w-5 text-red-800 dark:text-red-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <div className="text-3xl font-bold text-red-900 dark:text-red-500">
              {lowStockCount !== null ? <Counter value={lowStockCount} /> : 0}
            </div>
            <div
              className={cn(
                "ml-2 flex items-center text-xs font-medium",
                lowStockCount && lowStockCount > 3
                  ? "text-red-700 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              )}
            >
              {lowStockCount && lowStockCount > 3 ? (
                <ArrowUpIcon className="h-3.5 w-3.5 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3.5 w-3.5 mr-1" />
              )}
              <span>
                {lowStockCount && lowStockCount > 3 ? "Critical" : "Normal"}
              </span>
            </div>
          </div>
          <p className="text-xs text-red-950/70 dark:text-red-200/70 mt-1">
            items need reordering
          </p>

          <div className="mt-4 h-1.5 w-full bg-red-200/50 dark:bg-red-900/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 to-rose-600 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: lowStockCount
                  ? `${Math.min((lowStockCount / 10) * 100, 100)}%`
                  : "0%",
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
        </CardContent>
      </MotionCard>
    </motion.div>
  );
}
