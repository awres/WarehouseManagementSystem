"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Users, ShoppingCart, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboardPage() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [newCustomersThisMonth, setNewCustomersThisMonth] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [ordersToday, setOrdersToday] = useState(0);
  useEffect(() => {
    const fetchTotalProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/products/");
        setTotalProducts(response.data.length);
      } catch (error) {
        console.error("Error fetching total products:", error);
      }
    };

    fetchTotalProducts();

    const fetchTotalUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/customers");
        setTotalCustomers(response.data.length);

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        const count = response.data.filter((customer: any) => {
          const createdAt = new Date(customer.created_at);
          return (
            createdAt.getFullYear() === currentYear &&
            createdAt.getMonth() === currentMonth
          );
        }).length;

        setNewCustomersThisMonth(count);
      } catch (error) {
        console.error("Error fetching total customers:", error);
      }
    };

    fetchTotalUsers();

    const fetchTotalOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/orders");
        setTotalOrders(response.data.length);
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];
        const count = response.data.filter((order: any) =>
          order.order_date.startsWith(todayStr)
        ).length;
        setOrdersToday(count);
      } catch (error) {
        console.error("Error fetching total orders:", error);
      }
    };

    fetchTotalOrders();
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the warehouse management admin panel
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {newCustomersThisMonth} new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {ordersToday} orders today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">2 critical issues</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <p className="text-sm font-medium">
                  User john.doe updated inventory
                </p>
                <p className="text-xs text-muted-foreground">Today at 14:32</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium">
                  New order #ORD-7899 received
                </p>
                <p className="text-xs text-muted-foreground">Today at 13:17</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium">
                  User admin.user added new product
                </p>
                <p className="text-xs text-muted-foreground">Today at 11:43</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium">System backup completed</p>
                <p className="text-xs text-muted-foreground">Today at 04:00</p>
              </div>
              <div>
                <p className="text-sm font-medium">User jane.smith logged in</p>
                <p className="text-xs text-muted-foreground">
                  Yesterday at 19:23
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Server Uptime</p>
                  <p className="text-xs text-muted-foreground">
                    Last restart: 32 days ago
                  </p>
                </div>
                <span className="flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Database Connection</p>
                  <p className="text-xs text-muted-foreground">
                    Response time: 45ms
                  </p>
                </div>
                <span className="flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">API Services</p>
                  <p className="text-xs text-muted-foreground">
                    All endpoints operational
                  </p>
                </div>
                <span className="flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Storage Usage</p>
                  <p className="text-xs text-muted-foreground">
                    68% of 500GB used
                  </p>
                </div>
                <span className="flex h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Backup System</p>
                  <p className="text-xs text-muted-foreground">
                    Last backup: 8 hours ago
                  </p>
                </div>
                <span className="flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
