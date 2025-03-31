import { Package, Search, Filter, Plus } from "lucide-react";
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

export default function InventoryPage() {
  const inventoryItems = [
    {
      id: 1,
      name: "Product A",
      sku: "SKU-001",
      category: "Electronics",
      quantity: 145,
      location: "Warehouse A",
      status: "In Stock",
    },
    {
      id: 2,
      name: "Product B",
      sku: "SKU-002",
      category: "Furniture",
      quantity: 23,
      location: "Warehouse B",
      status: "Low Stock",
    },
    {
      id: 3,
      name: "Product C",
      sku: "SKU-003",
      category: "Electronics",
      quantity: 67,
      location: "Warehouse A",
      status: "In Stock",
    },
    {
      id: 4,
      name: "Product D",
      sku: "SKU-004",
      category: "Clothing",
      quantity: 5,
      location: "Warehouse C",
      status: "Critical",
    },
    {
      id: 5,
      name: "Product E",
      sku: "SKU-005",
      category: "Electronics",
      quantity: 89,
      location: "Warehouse A",
      status: "In Stock",
    },
    {
      id: 6,
      name: "Product F",
      sku: "SKU-006",
      category: "Furniture",
      quantity: 42,
      location: "Warehouse B",
      status: "In Stock",
    },
    {
      id: 7,
      name: "Product G",
      sku: "SKU-007",
      category: "Clothing",
      quantity: 18,
      location: "Warehouse C",
      status: "Low Stock",
    },
    {
      id: 8,
      name: "Product H",
      sku: "SKU-008",
      category: "Electronics",
      quantity: 56,
      location: "Warehouse A",
      status: "In Stock",
    },
  ];

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
            href="/shipping"
            className="text-muted-foreground transition-colors hover:text-foreground/80"
          >
            Shipping
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
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
            >
              <Package className="h-4 w-4" />
              Inventory
            </Link>
            <Link
              href="/orders"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Package className="h-4 w-4" />
              Orders
            </Link>
            <Link
              href="/shipping"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Package className="h-4 w-4" />
              Shipping
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
              <Button>
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
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "In Stock"
                              ? "outline"
                              : item.status === "Low Stock"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
