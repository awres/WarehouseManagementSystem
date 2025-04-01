"use client";

import { Package, ShoppingCart, AlertTriangle, TrendingUp } from "lucide-react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export function StatsCards() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    const fetchTotalProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/products/");
        setTotalProducts(response.data.length);

        const lowStockProducts = response.data.filter(
          (product: { stock_quantity: number }) => product.stock_quantity <= 10
        );
        setLowStockCount(lowStockProducts.length);
      } catch (error) {
        console.error("Error fetching total products:", error);
      }
    };

    const fetchPendingOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8000/orders/");
        // Filtrujemy zamówienia, zostawiając tylko te ze statusem "PENDING"
        const pendingCount = response.data.filter(
          (order: { status: string }) => order.status === "PENDING"
        ).length;
        setPendingOrders(pendingCount);
      } catch (error) {
        console.error("Error fetching pending orders:", error);
      }
    };

    fetchTotalProducts();
    fetchPendingOrders();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs text-muted-foreground">items in stock</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingOrders}</div>
          <p className="text-xs text-muted-foreground">awaiting fulfillment</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Low Stock Alerts
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockCount}</div>
          <p className="text-xs text-muted-foreground">items need reordering</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Monthly Turnover
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+12.5%</div>
          <p className="text-xs text-muted-foreground">
            compared to last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
