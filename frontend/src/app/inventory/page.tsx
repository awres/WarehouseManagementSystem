"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Truck,
  ClipboardList,
  BarChart3,
  Settings,
  RefreshCcw,
  Package,
  Search,
  Filter,
  Plus,
  X,
  AlertTriangle,
  Save,
  Tag,
  Layers,
  DollarSign,
  PackageCheck,
  ArrowUpDown,
  ChevronDown,
  SlidersHorizontal,
  Check,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [stockFilter, setStockFilter] = useState<string | null>(null);

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

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    inventoryItems.forEach((item) => {
      if (item.category) uniqueCategories.add(item.category);
    });
    return Array.from(uniqueCategories);
  }, [inventoryItems]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    // First filter items based on search query and filters
    let result = inventoryItems;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          (item.barcode && item.barcode.toLowerCase().includes(query)) ||
          item.category.toLowerCase().includes(query) ||
          item.stock_quantity.toString().includes(query) ||
          item.price.toString().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter) {
      result = result.filter((item) => item.category === categoryFilter);
    }

    // Apply stock filter
    if (stockFilter) {
      switch (stockFilter) {
        case "in_stock":
          result = result.filter((item) => item.stock_quantity > 10);
          break;
        case "low_stock":
          result = result.filter(
            (item) => item.stock_quantity > 0 && item.stock_quantity <= 10
          );
          break;
        case "out_of_stock":
          result = result.filter((item) => item.stock_quantity === 0);
          break;
      }
    }

    // Then sort
    return [...result].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "stock":
          comparison = a.stock_quantity - b.stock_quantity;
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [
    inventoryItems,
    searchQuery,
    sortField,
    sortDirection,
    categoryFilter,
    stockFilter,
  ]);

  // Animation variants for modals
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Animation variants for backdrop
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Get stock status
  const getStockStatus = (quantity: number) => {
    if (quantity > 10) return "In Stock";
    if (quantity > 0) return "Low Stock";
    return "Out of Stock";
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
              <Button
                onClick={() => setShowModal(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search inventory..."
                  className="w-full bg-background pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Filter className="mr-2 h-4 w-4" />
                      Category
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter(null)}
                      className="flex items-center justify-between"
                    >
                      All Categories
                      {categoryFilter === null && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {categories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() => setCategoryFilter(category)}
                        className="flex items-center justify-between"
                      >
                        {category}
                        {categoryFilter === category && (
                          <Check className="h-4 w-4" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Layers className="mr-2 h-4 w-4" />
                      Stock
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem
                      onClick={() => setStockFilter(null)}
                      className="flex items-center justify-between"
                    >
                      All Stock Levels
                      {stockFilter === null && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setStockFilter("in_stock")}
                      className="flex items-center justify-between"
                    >
                      In Stock
                      {stockFilter === "in_stock" && (
                        <Check className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStockFilter("low_stock")}
                      className="flex items-center justify-between"
                    >
                      Low Stock
                      {stockFilter === "low_stock" && (
                        <Check className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStockFilter("out_of_stock")}
                      className="flex items-center justify-between"
                    >
                      Out of Stock
                      {stockFilter === "out_of_stock" && (
                        <Check className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Sort
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuCheckboxItem
                      checked={sortField === "name" && sortDirection === "asc"}
                      onCheckedChange={() => {
                        setSortField("name");
                        setSortDirection("asc");
                      }}
                    >
                      Name (A-Z)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortField === "name" && sortDirection === "desc"}
                      onCheckedChange={() => {
                        setSortField("name");
                        setSortDirection("desc");
                      }}
                    >
                      Name (Z-A)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={sortField === "price" && sortDirection === "asc"}
                      onCheckedChange={() => {
                        setSortField("price");
                        setSortDirection("asc");
                      }}
                    >
                      Price (Low to High)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={
                        sortField === "price" && sortDirection === "desc"
                      }
                      onCheckedChange={() => {
                        setSortField("price");
                        setSortDirection("desc");
                      }}
                    >
                      Price (High to Low)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={sortField === "stock" && sortDirection === "asc"}
                      onCheckedChange={() => {
                        setSortField("stock");
                        setSortDirection("asc");
                      }}
                    >
                      Stock (Low to High)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={
                        sortField === "stock" && sortDirection === "desc"
                      }
                      onCheckedChange={() => {
                        setSortField("stock");
                        setSortDirection("desc");
                      }}
                    >
                      Stock (High to Low)
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 rounded-lg mt-4 shadow-md ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                <div className="flex items-center">
                  {message.type === "success" ? (
                    <PackageCheck className="h-5 w-5 mr-2" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 mr-2" />
                  )}
                  {message.text}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active filters display */}
          {(categoryFilter || stockFilter) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {categoryFilter && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  Category: {categoryFilter}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => setCategoryFilter(null)}
                  />
                </Badge>
              )}
              {stockFilter && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {stockFilter === "in_stock"
                    ? "In Stock"
                    : stockFilter === "low_stock"
                    ? "Low Stock"
                    : "Out of Stock"}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => setStockFilter(null)}
                  />
                </Badge>
              )}
              {(categoryFilter || stockFilter) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    setCategoryFilter(null);
                    setStockFilter(null);
                  }}
                >
                  Clear all
                </Button>
              )}
            </div>
          )}

          <div className="rounded-lg border mt-6 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead
                      className="font-medium cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Name
                        {sortField === "name" && (
                          <ArrowUpDown
                            className={`ml-1 h-4 w-4 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="font-medium">SKU</TableHead>
                    <TableHead className="font-medium">Barcode</TableHead>
                    <TableHead
                      className="font-medium cursor-pointer"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center">
                        Category
                        {sortField === "category" && (
                          <ArrowUpDown
                            className={`ml-1 h-4 w-4 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-medium cursor-pointer"
                      onClick={() => handleSort("stock")}
                    >
                      <div className="flex items-center">
                        Quantity
                        {sortField === "stock" && (
                          <ArrowUpDown
                            className={`ml-1 h-4 w-4 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-medium cursor-pointer"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center">
                        Price
                        {sortField === "price" && (
                          <ArrowUpDown
                            className={`ml-1 h-4 w-4 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="text-right font-medium">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedItems.length > 0 ? (
                    filteredAndSortedItems.map((item, index) => {
                      const status = getStockStatus(item.stock_quantity);
                      return (
                        <TableRow
                          key={`${item.id}-${index}`}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                              {item.sku}
                            </span>
                          </TableCell>
                          <TableCell>
                            {item.barcode ? (
                              <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                {item.barcode}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                No Barcode
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {item.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {item.stock_quantity}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">${item.price}</div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                status === "In Stock"
                                  ? "outline"
                                  : status === "Low Stock"
                                  ? "secondary"
                                  : "destructive"
                              }
                              className={
                                status === "In Stock"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : status === "Low Stock"
                                  ? "bg-amber-100 text-amber-800 border-amber-200"
                                  : "bg-red-100 text-red-800 border-red-200"
                              }
                            >
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEdit(item)}
                                title="Edit Item"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => confirmDelete(item.id)}
                                title="Delete Item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        {searchQuery || categoryFilter || stockFilter ? (
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Search className="h-8 w-8 mb-2 opacity-50" />
                            <p>No matching products found</p>
                            <Button
                              variant="link"
                              onClick={() => {
                                setSearchQuery("");
                                setCategoryFilter(null);
                                setStockFilter(null);
                              }}
                              className="mt-2"
                            >
                              Clear all filters
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Package className="h-8 w-8 mb-2 opacity-50" />
                            <p>No products found</p>
                            <Button
                              variant="link"
                              onClick={() => setShowModal(true)}
                              className="mt-2"
                            >
                              Add your first product
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={backdropVariants}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md pointer-events-auto">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">Add New Item</h2>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product Name</label>
                    <div className="relative">
                      <Package className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        name="name"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select Category</option>
                        <option value="electronics">Electronics</option>
                        <option value="furniture">Furniture</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        name="price"
                        placeholder="0.00"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Stock Quantity
                    </label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        name="stock"
                        placeholder="0"
                        type="number"
                        value={formData.stock}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={backdropVariants}
              onClick={() => setShowEditModal(false)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md pointer-events-auto">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Save className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold">Edit Product</h2>
                  </div>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product Name</label>
                    <div className="relative">
                      <Package className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        name="name"
                        placeholder="Enter product name"
                        value={editFormData.name}
                        onChange={handleEditInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">SKU</label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          name="sku"
                          placeholder="SKU"
                          value={editFormData.sku}
                          onChange={handleEditInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Barcode</label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          name="barcode"
                          placeholder="Barcode"
                          value={editFormData.barcode}
                          onChange={handleEditInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <select
                        name="category"
                        value={editFormData.category}
                        onChange={handleEditInputChange}
                        className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Category</option>
                        <option value="electronics">Electronics</option>
                        <option value="furniture">Furniture</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          name="price"
                          placeholder="0.00"
                          type="number"
                          value={editFormData.price}
                          onChange={handleEditInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stock</label>
                      <div className="relative">
                        <Layers className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          name="stock_quantity"
                          placeholder="0"
                          type="number"
                          value={editFormData.stock_quantity}
                          onChange={handleEditInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button
                    onClick={handleEditSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={backdropVariants}
              onClick={cancelDelete}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md pointer-events-auto">
                <div className="flex flex-col items-center mb-6">
                  <div className="bg-red-100 p-4 rounded-full mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-center">
                    Confirm Deletion
                  </h2>
                  <p className="text-center mt-2 text-gray-600 dark:text-gray-300">
                    Are you sure you want to delete this product? This action
                    cannot be undone.
                  </p>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={cancelDelete}
                    className="w-1/2 border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="w-1/2 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
