import Link from "next/link";
import {
  Package,
  Truck,
  ClipboardList,
  BarChart3,
  Settings,
  Search,
  RefreshCcw,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample returns data
const returnsData = [
  {
    id: "RET-1001",
    orderId: "ORD-5732",
    customer: "John Smith",
    items: [{ name: "Wireless Headphones", quantity: 1 }],
    reason: "Defective",
    status: "Pending",
    date: "2023-04-12",
    refundAmount: "$89.99",
  },
  {
    id: "RET-1002",
    orderId: "ORD-6104",
    customer: "Sarah Johnson",
    items: [{ name: "Smart Watch", quantity: 1 }],
    reason: "Wrong Item",
    status: "Approved",
    date: "2023-04-10",
    refundAmount: "$129.99",
  },
  {
    id: "RET-1003",
    orderId: "ORD-5891",
    customer: "Michael Brown",
    items: [
      { name: "Bluetooth Speaker", quantity: 1 },
      { name: "USB Cable", quantity: 2 },
    ],
    reason: "Changed Mind",
    status: "Completed",
    date: "2023-04-08",
    refundAmount: "$78.50",
  },
  {
    id: "RET-1004",
    orderId: "ORD-6032",
    customer: "Emily Davis",
    items: [{ name: "Laptop Stand", quantity: 1 }],
    reason: "Not as Described",
    status: "Rejected",
    date: "2023-04-07",
    refundAmount: "$45.99",
  },
  {
    id: "RET-1005",
    orderId: "ORD-6201",
    customer: "David Wilson",
    items: [
      { name: "Wireless Mouse", quantity: 1 },
      { name: "Keyboard", quantity: 1 },
    ],
    reason: "Defective",
    status: "Pending",
    date: "2023-04-05",
    refundAmount: "$89.98",
  },
  {
    id: "RET-1006",
    orderId: "ORD-5978",
    customer: "Jessica Martinez",
    items: [{ name: "Monitor", quantity: 1 }],
    reason: "Arrived Damaged",
    status: "Approved",
    date: "2023-04-03",
    refundAmount: "$249.99",
  },
  {
    id: "RET-1007",
    orderId: "ORD-6089",
    customer: "Robert Taylor",
    items: [{ name: "External Hard Drive", quantity: 1 }],
    reason: "Changed Mind",
    status: "Completed",
    date: "2023-04-01",
    refundAmount: "$119.99",
  },
];

// Status badge component
function StatusBadge({ status }: { status: string }) {
  let variant: "outline" | "secondary" | "destructive" | "default" = "outline";

  switch (status) {
    case "Approved":
      variant = "secondary";
      break;
    case "Completed":
      variant = "default";
      break;
    case "Rejected":
      variant = "destructive";
      break;
    default:
      variant = "outline";
  }

  return <Badge variant={variant}>{status}</Badge>;
}

export default function Returns() {
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
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Returns Management</h1>
              <p className="text-muted-foreground">
                Track and process customer returns
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search returns..."
                    className="w-full pl-9"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Process Returns
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Returns</CardTitle>
                <CardDescription>
                  Manage customer return requests and process refunds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">
                        <div className="flex items-center gap-1">
                          Return ID
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Order ID
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Status
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          Date
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">
                        Refund Amount
                      </TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {returnsData.map((returnItem) => (
                      <TableRow key={returnItem.id}>
                        <TableCell className="font-medium">
                          {returnItem.id}
                        </TableCell>
                        <TableCell>{returnItem.orderId}</TableCell>
                        <TableCell>{returnItem.customer}</TableCell>
                        <TableCell>
                          {returnItem.items.map((item, index) => (
                            <div key={index}>
                              {item.quantity}x {item.name}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>{returnItem.reason}</TableCell>
                        <TableCell>
                          <StatusBadge status={returnItem.status} />
                        </TableCell>
                        <TableCell>{returnItem.date}</TableCell>
                        <TableCell className="text-right">
                          {returnItem.refundAmount}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>Update status</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                Process refund
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Reject return
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
