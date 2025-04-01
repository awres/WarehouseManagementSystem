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
import { Package, Search, Filter, Plus, X, AlertTriangle } from "lucide-react";
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
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
  const [editFormData, setEditFormData] = useState<{
    id: number;
    name: string;
    category: string;
    price: string;
    stock_quantity: string;
    sku: string;
    barcode: string;
  }>({
    id: 0,
    name: "",
    category: "",
    price: "",
    stock_quantity: "",
    sku: "",
    barcode: "",
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

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        stock_quantity: formData.stock.toString(),
      };

      await axios.post("http://localhost:8000/post/products/", payload);

      setMessage({ type: "success", text: "Product added successfully!" });
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
      setMessage({ type: "error", text: "Error adding product." });

      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleEdit = (item: Product) => {
    setEditFormData({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      stock_quantity: item.stock_quantity.toString(),
      sku: item.sku,
      barcode: item.barcode || "",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const payload = {
        ...editFormData,
        price: Number.parseFloat(editFormData.price),
        stock_quantity: Number.parseInt(editFormData.stock_quantity),
      };

      await axios.put(
        `http://localhost:8000/update/products/${editFormData.id}/`,
        payload
      );

      setMessage({
        type: "success",
        text: "Product updated successfully!",
      });
      setShowEditModal(false);
      fetchInventory();

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Update error:", error);
      setMessage({
        type: "error",
        text: "Error updating product.",
      });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const confirmDelete = (id: number) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (itemToDelete === null) return;

    try {
      await axios.delete(
        `http://localhost:8000/delete/products/${itemToDelete}/`
      );
      setMessage({
        type: "success",
        text: "Product deleted successfully!",
      });
      fetchInventory();
      setShowDeleteModal(false);
      setItemToDelete(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Delete error:", error);
      setMessage({
        type: "error",
        text: "Error deleting product.",
      });
      setShowDeleteModal(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
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
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
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
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-black text-white"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-red-600 text-white"
                          onClick={() => confirmDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Edit Item</h2>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <Input
              name="name"
              placeholder="Name"
              value={editFormData.name}
              onChange={handleEditInputChange}
              className="mb-2"
            />
            <Input
              name="sku"
              placeholder="SKU"
              value={editFormData.sku}
              onChange={handleEditInputChange}
              className="mb-2"
            />
            <Input
              name="barcode"
              placeholder="Barcode"
              value={editFormData.barcode}
              onChange={handleEditInputChange}
              className="mb-2"
            />
            <select
              name="category"
              value={editFormData.category}
              onChange={handleEditInputChange}
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
              value={editFormData.price}
              onChange={handleEditInputChange}
              className="mb-2"
            />
            <Input
              name="stock_quantity"
              placeholder="Stock Quantity"
              type="number"
              value={editFormData.stock_quantity}
              onChange={handleEditInputChange}
              className="mb-4"
            />
            <Button onClick={handleEditSubmit} className="w-full">
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-96">
            <div className="flex flex-col items-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500 mb-2" />
              <h2 className="text-lg font-bold text-center">
                Confirm Deletion
              </h2>
              <p className="text-center mt-2">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>
            </div>
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={cancelDelete}
                className="w-1/2 mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="w-1/2 ml-2 bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
