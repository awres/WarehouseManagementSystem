"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Truck,
  ClipboardList,
  BarChart3,
  Settings,
  RefreshCcw,
  Package,
  Search,
  ChevronDown,
  ArrowUpDown,
  SlidersHorizontal,
  Check,
  X,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  LineChart,
} from "lucide-react";
import axios from "axios";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Sorting and filtering states
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get/customers/");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
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

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    // First filter customers based on search query and filters
    let result = customers;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (customer) =>
          `${customer.first_name} ${customer.last_name}`
            .toLowerCase()
            .includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.toLowerCase().includes(query) ||
          customer.address.toLowerCase().includes(query)
      );
    }

    // Apply date filter
    if (dateFilter) {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      switch (dateFilter) {
        case "today": {
          result = result.filter((customer) =>
            new Date(customer.created_at).toISOString().startsWith(todayStr)
          );
          break;
        }
        case "this_week": {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          result = result.filter(
            (customer) => new Date(customer.created_at) >= weekStart
          );
          break;
        }
        case "this_month": {
          const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
          result = result.filter(
            (customer) => new Date(customer.created_at) >= monthStart
          );
          break;
        }
        case "last_30_days": {
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          result = result.filter(
            (customer) => new Date(customer.created_at) >= thirtyDaysAgo
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
        case "name":
          comparison = `${a.first_name} ${a.last_name}`.localeCompare(
            `${b.first_name} ${b.last_name}`
          );
          break;
        case "email":
          comparison = a.email.localeCompare(b.email);
          break;
        case "phone":
          comparison = a.phone.localeCompare(b.phone);
          break;
        case "address":
          comparison = a.address.localeCompare(b.address);
          break;
        case "created_at":
          comparison =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "updated_at":
          comparison =
            new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
        default:
          comparison =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [customers, searchQuery, sortField, sortDirection, dateFilter]);

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
            className="text-muted-foreground hover:text-foreground/80"
          >
            Dashboard
          </Link>
          <Link
            href="/inventory"
            className="text-muted-foreground hover:text-foreground/80"
          >
            Inventory
          </Link>
          <Link
            href="/orders"
            className="text-muted-foreground hover:text-foreground/80"
          >
            Orders
          </Link>
          <Link
            href="/customers"
            className="font-medium hover:text-foreground/80"
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
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
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
                <h1 className="text-3xl font-bold">Customers</h1>
                <p className="text-muted-foreground">
                  Manage your customer base
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background pl-8"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
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
                      checked={
                        sortField === "created_at" && sortDirection === "desc"
                      }
                      onCheckedChange={() => {
                        setSortField("created_at");
                        setSortDirection("desc");
                      }}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Newest First
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={
                        sortField === "created_at" && sortDirection === "asc"
                      }
                      onCheckedChange={() => {
                        setSortField("created_at");
                        setSortDirection("asc");
                      }}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Oldest First
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={sortField === "name" && sortDirection === "asc"}
                      onCheckedChange={() => {
                        setSortField("name");
                        setSortDirection("asc");
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Name (A-Z)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortField === "name" && sortDirection === "desc"}
                      onCheckedChange={() => {
                        setSortField("name");
                        setSortDirection("desc");
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Name (Z-A)
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Active filters display */}
          {dateFilter && (
            <div className="flex flex-wrap gap-2 mt-4">
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
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  setDateFilter(null);
                }}
              >
                Clear all
              </Button>
            </div>
          )}

          <div className="rounded-lg border shadow-sm mt-6 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead
                      className="w-[60px] font-medium cursor-pointer"
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
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
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
                    <TableHead
                      className="font-medium cursor-pointer"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        Email
                        {sortField === "email" && (
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
                      onClick={() => handleSort("phone")}
                    >
                      <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                        Phone
                        {sortField === "phone" && (
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
                      onClick={() => handleSort("address")}
                    >
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        Address
                        {sortField === "address" && (
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
                      onClick={() => handleSort("created_at")}
                    >
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        Created
                        {sortField === "created_at" && (
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
                  {filteredAndSortedCustomers.length > 0 ? (
                    filteredAndSortedCustomers.map((customer) => (
                      <TableRow
                        key={customer.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <TableCell>
                          <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                            #{customer.id}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">{`${customer.first_name} ${customer.last_name}`}</TableCell>
                        <TableCell>
                          <a
                            href={`mailto:${customer.email}`}
                            className="text-primary hover:underline"
                          >
                            {customer.email}
                          </a>
                        </TableCell>
                        <TableCell>
                          <a
                            href={`tel:${customer.phone}`}
                            className="hover:underline"
                          >
                            {customer.phone}
                          </a>
                        </TableCell>
                        <TableCell
                          className="max-w-[200px] truncate"
                          title={customer.address}
                        >
                          {customer.address}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {new Date(
                                customer.created_at
                              ).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(customer.created_at).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <User className="h-8 w-8 mb-2 opacity-50" />
                          <p>No customers found</p>
                          {(searchQuery || dateFilter) && (
                            <Button
                              variant="link"
                              onClick={() => {
                                setSearchQuery("");
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
    </div>
  );
}
