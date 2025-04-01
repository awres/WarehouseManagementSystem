"use client";

import type React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  RefreshCcw,
  Package,
  Truck,
  ClipboardList,
  Search,
  BarChart3,
  AlertTriangle,
  X,
  Save,
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
import { motion, AnimatePresence } from "framer-motion";

interface Order {
  id: number;
  customer: {
    first_name: string;
    last_name: string;
  };
  status: string;
  total: number;
  order_date: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    customer_first_name: "",
    customer_last_name: "",
    status: "",
    total: "",
  });

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get/orders/");
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      const filtered = orders.filter(
        (order) =>
          `${order.customer.first_name} ${order.customer.last_name}`
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          order.status.toLowerCase().includes(query.toLowerCase()) ||
          order.total.toString().includes(query)
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    let badgeClass = "";
    const normalizedStatus = status.toUpperCase();

    switch (normalizedStatus) {
      case "PENDING":
        badgeClass = "border-2 border-blue-500 text-white bg-blue-500";
        break;
      case "SHIPPED":
        badgeClass = "border-2 border-green-500 text-white bg-green-500";
        break;
      case "CANCELLED":
        badgeClass = "border-2 border-red-500 text-white bg-red-500";
        break;
      case "PROCESSING":
        badgeClass = "border-2 border-yellow-500 text-white bg-yellow-500";
        break;
      default:
        badgeClass = "border-2 border-gray-500 text-gray-500";
        break;
    }
    return badgeClass;
  };

  const confirmDelete = (id: number) => {
    setSelectedOrderId(id);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedOrderId(null);
  };

  const handleDelete = async () => {
    try {
      if (selectedOrderId) {
        await axios.delete(
          `http://localhost:8000/delete/orders/${selectedOrderId}/`
        );
        setOrders(orders.filter((order) => order.id !== selectedOrderId));
        setFilteredOrders(
          filteredOrders.filter((order) => order.id !== selectedOrderId)
        );
        setShowDeleteModal(false);
        setSelectedOrderId(null);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const editOrder = (order: Order) => {
    setSelectedOrderId(order.id);
    setEditFormData({
      customer_first_name: order.customer.first_name,
      customer_last_name: order.customer.last_name,
      status: order.status,
      total: order.total.toString(),
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      if (selectedOrderId) {
        await axios.put(
          `http://localhost:8000/update/orders/${selectedOrderId}/`,
          editFormData
        );

        // Update the orders state with the edited order
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === selectedOrderId
              ? {
                  ...order,
                  customer: {
                    first_name: editFormData.customer_first_name,
                    last_name: editFormData.customer_last_name,
                  },
                  status: editFormData.status,
                  total: Number.parseFloat(editFormData.total),
                }
              : order
          )
        );

        // Update the filteredOrders state as well
        setFilteredOrders((prevFilteredOrders) =>
          prevFilteredOrders.map((order) =>
            order.id === selectedOrderId
              ? {
                  ...order,
                  customer: {
                    first_name: editFormData.customer_first_name,
                    last_name: editFormData.customer_last_name,
                  },
                  status: editFormData.status,
                  total: Number.parseFloat(editFormData.total),
                }
              : order
          )
        );

        setShowEditModal(false);
        setSelectedOrderId(null);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
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
            href="/returns"
            className="text-muted-foreground transition-colors hover:text-foreground/80"
          >
            Returns
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
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
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
            <div>
              <h1 className="text-3xl font-bold">Orders</h1>
              <p className="text-muted-foreground">Manage your orders</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full bg-background pl-8"
                />
              </div>
            </div>
          </div>
          <div className="rounded-lg border mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell className="font-medium ">{`${order.customer.first_name} ${order.customer.last_name}`}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-3 py-1 rounded-full border ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(order.order_date).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-black hover:bg-black hover:text-white transition-colors"
                          onClick={() => editOrder(order)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          onClick={() => confirmDelete(order.id)}
                        >
                          Cancel
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
                    <h2 className="text-xl font-bold">Edit Order</h2>
                  </div>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <Input
                        name="customer_first_name"
                        placeholder="First Name"
                        value={editFormData.customer_first_name}
                        onChange={handleEditInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <Input
                        name="customer_last_name"
                        placeholder="Last Name"
                        value={editFormData.customer_last_name}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Total</label>
                    <Input
                      name="total"
                      placeholder="0.00"
                      type="number"
                      value={editFormData.total}
                      onChange={handleEditInputChange}
                    />
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
                    Confirm Cancellation
                  </h2>
                  <p className="text-center mt-2 text-gray-600 dark:text-gray-300">
                    Are you sure you want to cancel this order? This action
                    cannot be undone.
                  </p>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={cancelDelete}
                    className="w-1/2 border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Go Back
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="w-1/2 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Cancel Order
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
