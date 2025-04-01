"use client";

import type React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Truck,
  ClipboardList,
  BarChart3,
  Settings,
  RefreshCcw,
} from "lucide-react";
import { Package, Search, Filter, Plus, X } from "lucide-react";
import Link from "next/link";
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

interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  stock_quantity: number;
  price: number;
}

export default function InventoryPage() {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });
  const [inventoryItems, setInventoryItems] = useState<Product[]>([]);

  const fetchInventory = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get/products/");
      setInventoryItems(response.data);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        stock_quantity: formData.stock.toString(),
      };

      await axios.post("http://localhost:8000/post/products/", payload);

      setMessage({ type: "success", text: "Produkt dodany pomyślnie!" });
      setShowModal(false);

      setFormData({
        name: "",
        category: "",
        price: "",
        stock: "",
      });

      fetchInventory();

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Błąd podczas dodawania produktu." });

      setTimeout(() => setMessage(null), 3000);
    }
  };

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
            className="font-medium transition-colors hover:text-foreground/80"
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
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/settings">Settings</Link>
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
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/inventory"
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
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
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Inventory</h1>
                <p className="text-muted-foreground">
                  Manage your warehouse inventory
                </p>
              </div>
              <Button onClick={() => setShowModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search inventory..."
                  className="w-full bg-background pl-8"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>
          </div>
          {message && (
            <div
              className={`p-3 rounded-lg ${
                message.type === "success"
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="rounded-lg border mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nazwa</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Kategoria</TableHead>
                  <TableHead>Ilość</TableHead>
                  <TableHead>Cena</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map((item, index) => (
                  <TableRow key={`${item.id}-${index}`}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.barcode || "No Barcode"}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.stock_quantity}</TableCell>
                    <TableCell>{item.price || "Unknown"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.stock_quantity > 10
                            ? "outline"
                            : item.stock_quantity > 0
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {item.stock_quantity > 10
                          ? "In Stock"
                          : item.stock_quantity > 0
                          ? "Low Stock"
                          : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-black text-white"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add New Item</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <Input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="mb-2"
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
            </select>

            <Input
              name="price"
              placeholder="Price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              className="mb-2"
            />
            <Input
              name="stock"
              placeholder="Stock Quantity"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              className="mb-4"
            />
            <Button onClick={handleSubmit} className="w-full">
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
