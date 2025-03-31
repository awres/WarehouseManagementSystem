"use client";

import { Package, Search, Filter, Plus, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { table } from "console";

const URL = "http://localhost:8000/";

export default function OrdersPage() {
  const [searchedValue, setSearchedValue] = useState("");
  const [orders, setOrders] = useState<
    {
      id: number;
      customerName: string;
      date: string;
      status: string;
      amount: number;
    }[]
  >([]);

  const fetchOrders = async () => {
    try {
      const customerId = 1;
      const res = await axios.get(`${URL}orders`);

      const ordersData = res.data.map((order: any) => ({
        id: order.id,
        customerName: order.customer_name,
        date: order.order_date,
        status: order.status,
        amount: parseFloat(order.total),
      }));

      setOrders(ordersData);
    } catch (err) {
      console.error("Błąd podczas pobierania zamówień:", err);
    }
  };
  useEffect(() => {
    fetchOrders();
    console.log(orders);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
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
            className="font-medium transition-colors hover:text-foreground/80"
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
            href="/reports"
            className="text-muted-foreground transition-colors hover:text-foreground/80"
          >
            Reports
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm">
            Settings
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <nav className="grid gap-2 p-4 text-sm">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Package className="h-4 w-4" />
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
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
            >
              <ClipboardList className="h-4 w-4" />
              Orders
            </Link>
            <Link
              href="/customers"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Package className="h-4 w-4" />
              Customers
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6 flex flex-col items-center overflow-x-hidden">
          <div className="w-full max-w-4xl text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              Search for Orders
            </h1>
            <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-md w-full">
              <Search />
              <input
                type="text"
                placeholder="Search..."
                value={searchedValue}
                className="p-2 rounded-md border border-gray-300 flex-1 mx-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearchedValue(e.target.value)}
              />
              <Button className="mr-4">Add New Order</Button>
            </div>
            <Table className="w-full max-w-4xl">
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.customerName}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "Completed"
                            ? "outline"
                            : item.status === "Processing"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
}
