"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Define the Customer type
type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Customer | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("adminAuth");
      setIsAuthenticated(auth === "true");
      setIsLoading(false);
      if (auth !== "true" && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [pathname, router]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:8000/get/customers");
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data: Customer[] = await response.json();
        console.log("Fetched customers:", data); // Debugging
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredCustomers(
      customers.filter((customer) =>
        `${customer.first_name} ${customer.last_name}`
          .toLowerCase()
          .includes(query)
      )
    );
  };

  const handleEditClick = (customer: Customer) => {
    setEditFormData({ ...customer });
    setIsEditDialogOpen(true);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!editFormData) return;

    try {
      const response = await fetch(
        `http://localhost:8000/update/customers/${editFormData.id}/`,
        {
          method: "PATCH", // use PATCH if backend supports partial updates
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: editFormData.first_name,
            last_name: editFormData.last_name,
            email: editFormData.email,
            phone: editFormData.phone,
            address: editFormData.address,
            updated_at: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        alert("Failed to update customer ❌");
        return;
      }

      // Try parsing returned customer object
      const updatedCustomer = await response.json();

      setCustomers((prev) =>
        prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
      );
      setFilteredCustomers((prev) =>
        prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
      );

      setIsEditDialogOpen(false);
      setEditFormData(null);
      alert("Customer updated successfully! ✅");
    } catch (error) {
      console.error("Error saving customer data:", error);
      alert("Error updating customer ❌");
    }
  };

  if (isLoading) return null;
  if (pathname === "/admin/login" || !isAuthenticated) return <>{children}</>;

  return (
    <main className="flex-1 p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer base</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-background pl-8"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border mt-6">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Created At</th>
              <th className="px-4 py-2 text-left">Updated At</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 py-2">{customer.id}</td>
                <td className="px-4 py-2">{`${customer.first_name} ${customer.last_name}`}</td>
                <td className="px-4 py-2">{customer.email}</td>
                <td className="px-4 py-2">{customer.phone}</td>
                <td className="px-4 py-2">{customer.address}</td>
                <td className="px-4 py-2">
                  {new Date(customer.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {new Date(customer.updated_at).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(customer)}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {editFormData && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="first_name" className="text-right">
                  First Name
                </Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={editFormData.first_name}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="last_name" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={editFormData.last_name}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Updated At</Label>
                <div className="col-span-3 text-sm text-muted-foreground">
                  {new Date().toLocaleString()}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
