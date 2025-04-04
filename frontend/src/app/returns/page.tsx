"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  Package,
  Truck,
  ClipboardList,
  BarChart3,
  Settings,
  Search,
  RefreshCcw,
  Filter,
  ArrowUpDown,
  Calendar,
  ChevronDown,
  SlidersHorizontal,
  Check,
  X,
  AlertCircle,
  Clock,
  FileText,
  Package2,
  LineChart,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

function StatusBadge({ status }: { status: string }) {
  let variant: "outline" | "secondary" | "destructive" | "default" = "outline";
  let statusText = status;

  switch (status.toUpperCase()) {
    case "PENDING":
      variant = "secondary";
      statusText = "Pending";
      break;
    case "APPROVED":
    case "APROVED": // Handle typo in the API
      variant = "default";
      statusText = "Approved";
      break;
    case "REJECTED":
      variant = "destructive";
      statusText = "Rejected";
      break;
    default:
      variant = "outline";
  }

  return <Badge variant={variant}>{statusText}</Badge>;
}

interface Return {
  id: number;
  status: string;
  order_item: number;
  return_date: string;
  notes: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock_quantity: number;
  barcode: number;
}

interface Item {
  id: number;
  order: number;
  product: number;
  quantity: number;
  price: number;
}

const URL = "http://localhost:8000/";

export default function Returns() {
  const [returns, setReturns] = useState<Return[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting and filtering states
  const [sortField, setSortField] = useState<string>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${URL}get/products`);
      setProducts(res.data);
    } catch (err) {
      console.log("Error fetching products: " + err);
    }
  };

  const fetchOrderItems = async () => {
    try {
      const res = await axios.get(`${URL}get/orderitems/`);
      setItems(res.data);
    } catch (err) {
      console.log("Error fetching order items: " + err);
    }
  };

  const fetchReturns = async () => {
    try {
      const res = await axios.get(`${URL}get/returns/`);
      setReturns(res.data);
    } catch (err) {
      console.log("Error fetching returns: " + err);
    }
  };

  const getProductById = (orderItemId: number) => {
    const orderItem = items.find((item) => item.id === orderItemId);
    if (!orderItem) return "No product";

    const product = products.find((p) => p.id === orderItem.product);
    return product ? product.name : "No product";
  };

  useEffect(() => {
    fetchOrderItems();
    fetchProducts();
    fetchReturns();
  }, []);

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
    returns.forEach((returnItem) => {
      if (returnItem.status)
        uniqueStatuses.add(returnItem.status.toUpperCase());
    });
    return Array.from(uniqueStatuses);
  }, [returns]);

  // Filter and sort returns
  const filteredAndSortedReturns = useMemo(() => {
    // First filter returns based on search query and filters
    let result = returns;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (returnItem) =>
          returnItem.id.toString().includes(query) ||
          returnItem.status.toLowerCase().includes(query) ||
          returnItem.notes.toLowerCase().includes(query) ||
          getProductById(returnItem.order_item).toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter(
        (returnItem) => returnItem.status.toUpperCase() === statusFilter
      );
    }

    // Apply date filter
    if (dateFilter) {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      switch (dateFilter) {
        case "today":
          result = result.filter((returnItem) =>
            returnItem.return_date.startsWith(todayStr)
          );
          break;
        case "this_week": {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          result = result.filter(
            (returnItem) => new Date(returnItem.return_date) >= weekStart
          );
          break;
        }
        case "this_month": {
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          result = result.filter(
            (returnItem) => new Date(returnItem.return_date) >= monthStart
          );
          break;
        }
        case "last_30_days": {
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          result = result.filter(
            (returnItem) => new Date(returnItem.return_date) >= thirtyDaysAgo
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
        case "order":
          comparison = a.order_item - b.order_item;
          break;
        case "date":
          comparison =
            new Date(a.return_date).getTime() -
            new Date(b.return_date).getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison =
            new Date(a.return_date).getTime() -
            new Date(b.return_date).getTime();
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [
    returns,
    searchQuery,
    sortField,
    sortDirection,
    statusFilter,
    dateFilter,
    items,
    products,
  ]);

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
            className="font-medium transition-colors hover:text-foreground/80"
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
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
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
                <h1 className="text-3xl font-bold">Returns Management</h1>
                <p className="text-muted-foreground">
                  Track and process customer returns
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search returns..."
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
                                ? "bg-amber-500"
                                : status === "APPROVED" || status === "APROVED"
                                ? "bg-green-500"
                                : status === "REJECTED"
                                ? "bg-red-500"
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
                    <DropdownMenuItem
                      onClick={() => setDateFilter("last_30_days")}
                      className="flex items-center justify-between"
                    >
                      Last 30 Days
                      {dateFilter === "last_30_days" && (
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
                      checked={sortField === "id" && sortDirection === "asc"}
                      onCheckedChange={() => {
                        setSortField("id");
                        setSortDirection("asc");
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Return ID (Low to High)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortField === "id" && sortDirection === "desc"}
                      onCheckedChange={() => {
                        setSortField("id");
                        setSortDirection("desc");
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Return ID (High to Low)
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                    {statusFilter.charAt(0) +
                      statusFilter.slice(1).toLowerCase()}
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
                      : dateFilter === "this_month"
                      ? "This Month"
                      : "Last 30 Days"}
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

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Returns</CardTitle>
                <CardDescription>
                  Manage customer return requests and process refunds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead
                          className="w-[100px] font-medium cursor-pointer"
                          onClick={() => handleSort("id")}
                        >
                          <div className="flex items-center">
                            Return ID
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
                          onClick={() => handleSort("order")}
                        >
                          <div className="flex items-center">
                            Order ID
                            {sortField === "order" && (
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
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            Date
                            {sortField === "date" && (
                              <ArrowUpDown
                                className={`ml-1 h-4 w-4 ${
                                  sortDirection === "desc" ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="font-medium">
                          <div className="flex items-center">
                            <Package2 className="mr-2 h-4 w-4 text-muted-foreground" />
                            Items
                          </div>
                        </TableHead>
                        <TableHead className="font-medium">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                            Description
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-medium cursor-pointer"
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex items-center">
                            <AlertCircle className="mr-2 h-4 w-4 text-muted-foreground" />
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedReturns.length > 0 ? (
                        filteredAndSortedReturns.map((returnItem) => (
                          <TableRow
                            key={returnItem.id}
                            className="hover:bg-muted/50 transition-colors"
                          >
                            <TableCell className="font-medium">
                              <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                #{returnItem.id}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                #{returnItem.order_item}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {new Date(
                                    returnItem.return_date
                                  ).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    returnItem.return_date
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {getProductById(returnItem.order_item)}
                              </div>
                            </TableCell>
                            <TableCell
                              className="max-w-[200px] truncate"
                              title={returnItem.notes}
                            >
                              {returnItem.notes || "No description"}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={returnItem.status} />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <RefreshCcw className="h-8 w-8 mb-2 opacity-50" />
                              <p>No returns found</p>
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
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
