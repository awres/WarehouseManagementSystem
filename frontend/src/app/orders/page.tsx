"use client";

import type React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect, useMemo } from "react";
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
  Settings,
  ChevronDown,
  Filter,
  ArrowUpDown,
  Eye,
  Edit,
  XCircle,
  Calendar,
  Check,
  SlidersHorizontal,
  Plus,
  Clock,
  DollarSign,
  User,
  LineChart,
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    customer_first_name: "",
    customer_last_name: "",
    status: "",
    total: "",
  });

  // Filtering and sorting states
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get/orders/");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

        setShowEditModal(false);
        setSelectedOrderId(null);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
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

  // Get unique statuses for filter
  const statuses = useMemo(() => {
    const uniqueStatuses = new Set<string>();
    orders.forEach((order) => {
      if (order.status) uniqueStatuses.add(order.status.toUpperCase());
    });
    return Array.from(uniqueStatuses);
  }, [orders]);

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    // First filter orders based on search query and filters
    let result = orders;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          `${order.customer.first_name} ${order.customer.last_name}`
            .toLowerCase()
            .includes(query) ||
          order.status.toLowerCase().includes(query) ||
          order.total.toString().includes(query) ||
          order.id.toString().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter(
        (order) => order.status.toUpperCase() === statusFilter
      );
    }

    // Apply date filter
    if (dateFilter) {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      switch (dateFilter) {
        case "today":
          result = result.filter((order) =>
            order.order_date.startsWith(todayStr)
          );
          break;
        case "this_week": {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          result = result.filter(
            (order) => new Date(order.order_date) >= weekStart
          );
          break;
        }
        case "this_month": {
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          result = result.filter(
            (order) => new Date(order.order_date) >= monthStart
          );
          break;
        }
      }
    }

    // Then sort
    return [...result].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "id":
          comparison = a.id - b.id;
          break;
        case "customer":
          comparison =
            `${a.customer.first_name} ${a.customer.last_name}`.localeCompare(
              `${b.customer.first_name} ${b.customer.last_name}`
            );
          break;
        case "total":
          comparison = a.total - b.total;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "date":
          comparison =
            new Date(a.order_date).getTime() - new Date(b.order_date).getTime();
          break;
        default:
          comparison =
            new Date(a.order_date).getTime() - new Date(b.order_date).getTime();
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [orders, searchQuery, sortField, sortDirection, statusFilter, dateFilter]);

  const getStatusBadgeClass = (status: string) => {
    const normalizedStatus = status.toUpperCase();

    switch (normalizedStatus) {
      case "PENDING":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "SHIPPED":
        return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      case "PROCESSING":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toUpperCase();

    switch (normalizedStatus) {
      case "PENDING":
        return <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>;
      case "SHIPPED":
        return <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>;
      case "CANCELLED":
        return <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>;
      case "PROCESSING":
        return <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>;
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
          <Link
            href="/analytics"
            className="text-muted-foreground transition-colors hover:text-foreground/80"
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
            <Link
              href="/analytics"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <LineChart className="h-4 w-4" />
              Analytics
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Orders</h1>
                <p className="text-muted-foreground">Manage your orders</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background pl-8"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Filter className="mr-2 h-4 w-4" />
                      Status
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem
                      onClick={() => setStatusFilter(null)}
                      className="flex items-center justify-between"
                    >
                      All Statuses
                      {statusFilter === null && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {statuses.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              status === "PENDING"
                                ? "bg-blue-500"
                                : status === "SHIPPED"
                                ? "bg-green-500"
                                : status === "CANCELLED"
                                ? "bg-red-500"
                                : status === "PROCESSING"
                                ? "bg-amber-500"
                                : "bg-gray-500"
                            }`}
                          ></div>
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </div>
                        {statusFilter === status && (
                          <Check className="h-4 w-4" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Calendar className="mr-2 h-4 w-4" />
                      Date
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem
                      onClick={() => setDateFilter(null)}
                      className="flex items-center justify-between"
                    >
                      All Time
                      {dateFilter === null && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setDateFilter("today")}
                      className="flex items-center justify-between"
                    >
                      Today
                      {dateFilter === "today" && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDateFilter("this_week")}
                      className="flex items-center justify-between"
                    >
                      This Week
                      {dateFilter === "this_week" && (
                        <Check className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDateFilter("this_month")}
                      className="flex items-center justify-between"
                    >
                      This Month
                      {dateFilter === "this_month" && (
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
                  <DropdownMenuContent align="end" className="w-[220px]">
                    <DropdownMenuCheckboxItem
                      checked={sortField === "date" && sortDirection === "desc"}
                      onCheckedChange={() => {
                        setSortField("date");
                        setSortDirection("desc");
                      }}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Newest First
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortField === "date" && sortDirection === "asc"}
                      onCheckedChange={() => {
                        setSortField("date");
                        setSortDirection("asc");
                      }}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Oldest First
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={
                        sortField === "total" && sortDirection === "desc"
                      }
                      onCheckedChange={() => {
                        setSortField("total");
                        setSortDirection("desc");
                      }}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Highest Total
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortField === "total" && sortDirection === "asc"}
                      onCheckedChange={() => {
                        setSortField("total");
                        setSortDirection("asc");
                      }}
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Lowest Total
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={
                        sortField === "customer" && sortDirection === "asc"
                      }
                      onCheckedChange={() => {
                        setSortField("customer");
                        setSortDirection("asc");
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Customer (A-Z)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={
                        sortField === "customer" && sortDirection === "desc"
                      }
                      onCheckedChange={() => {
                        setSortField("customer");
                        setSortDirection("desc");
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Customer (Z-A)
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Active filters display */}
          {(statusFilter || dateFilter) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {statusFilter && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  Status:{" "}
                  {statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase()}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => setStatusFilter(null)}
                  />
                </Badge>
              )}
              {dateFilter && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {dateFilter === "today"
                    ? "Today"
                    : dateFilter === "this_week"
                    ? "This Week"
                    : "This Month"}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => setDateFilter(null)}
                  />
                </Badge>
              )}
              {(statusFilter || dateFilter) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => {
                    setStatusFilter(null);
                    setDateFilter(null);
                  }}
                >
                  Clear all
                </Button>
              )}
            </div>
          )}

          <div className="rounded-lg border shadow-sm mt-6 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead
                      className="w-[80px] font-medium cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">
                        ID
                        {sortField === "id" && (
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
                      onClick={() => handleSort("customer")}
                    >
                      <div className="flex items-center">
                        Customer
                        {sortField === "customer" && (
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
                      onClick={() => handleSort("total")}
                    >
                      <div className="flex items-center">
                        Total
                        {sortField === "total" && (
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
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === "status" && (
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
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center">
                        Order Date
                        {sortField === "date" && (
                          <ArrowUpDown
                            className={`ml-1 h-4 w-4 ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right font-medium">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedOrders.length > 0 ? (
                    filteredAndSortedOrders.map((order) => (
                      <TableRow
                        key={order.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                            #{order.id}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{`${order.customer.first_name} ${order.customer.last_name}`}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">${order.total}</div>
                        </TableCell>
                        <TableCell>
                          <div
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1).toLowerCase()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {new Date(order.order_date).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(order.order_date).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => editOrder(order)}
                              title="Edit Order"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => confirmDelete(order.id)}
                              title="Cancel Order"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <ClipboardList className="h-8 w-8 mb-2 opacity-50" />
                          <p>No orders found</p>
                          {(searchQuery || statusFilter || dateFilter) && (
                            <Button
                              variant="link"
                              onClick={() => {
                                setSearchQuery("");
                                setStatusFilter(null);
                                setDateFilter(null);
                              }}
                              className="mt-2"
                            >
                              Clear all filters
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        name="total"
                        placeholder="0.00"
                        type="number"
                        value={editFormData.total}
                        onChange={handleEditInputChange}
                        className="pl-10"
                      />
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
