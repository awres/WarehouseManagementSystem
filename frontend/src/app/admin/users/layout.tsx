"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input"; // Assuming the Input component is available
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react"; // Assuming you meant to use the Search icon
import React from "react";

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
  const [customers, setCustomers] = useState<Customer[]>([]); // Store all customers
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]); // Store filtered customers
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null); // Track customer being edited
  const [editFormData, setEditFormData] = useState<Customer | null>(null); // Track edited data

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

  // Fetch customers data from the API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:8000/customers");
        const data: Customer[] = await response.json();
        setCustomers(data); // Set all customers
        setFilteredCustomers(data); // Initially, show all customers
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter customers based on the search query
    setFilteredCustomers(
      customers.filter((customer) =>
        `${customer.first_name} ${customer.last_name}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    );
  };

  // Handle Edit button click to populate form for editing
  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer); // Set customer to edit
    setEditFormData(customer); // Populate the form with the current customer data
  };

  // Handle input change in the edit form
  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [event.target.name]: event.target.value,
      });
    }
  };

  // Handle Save changes
  const handleSaveChanges = async () => {
    if (editFormData) {
      try {
        const response = await fetch(
          `http://localhost:8000/customers/${editFormData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editFormData),
          }
        );

        if (response.ok) {
          // Update customers list and hide the edit form
          setCustomers((prevCustomers) =>
            prevCustomers.map((customer) =>
              customer.id === editFormData.id ? editFormData : customer
            )
          );
          setEditingCustomer(null);
          setEditFormData(null);
        } else {
          console.error("Failed to save changes");
        }
      } catch (error) {
        console.error("Error saving customer data:", error);
      }
    }
  };

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // If on login page or not authenticated, just render children
  if (pathname === "/admin/login" || !isAuthenticated) {
    return <>{children}</>;
  }

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
              <React.Fragment key={customer.id}>
                <tr>
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
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => handleEditClick(customer)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>

                {/* Row for editing customer */}
                {editingCustomer?.id === customer.id && (
                  <tr className="bg-gray-200">
                    <td colSpan={8} className="px-4 py-2">
                      <div className="space-y-4">
                        {/* Label and Input for First Name */}
                        <div>
                          <label htmlFor="first_name">First Name</label>
                          <Input
                            id="first_name"
                            name="first_name"
                            value={editFormData?.first_name || ""}
                            onChange={handleEditChange}
                          />
                        </div>

                        {/* Label and Input for Last Name */}
                        <div>
                          <label htmlFor="last_name">Last Name</label>
                          <Input
                            id="last_name"
                            name="last_name"
                            value={editFormData?.last_name || ""}
                            onChange={handleEditChange}
                          />
                        </div>

                        {/* Label and Input for Email */}
                        <div>
                          <label htmlFor="email">Email</label>
                          <Input
                            id="email"
                            name="email"
                            value={editFormData?.email || ""}
                            onChange={handleEditChange}
                          />
                        </div>

                        {/* Label and Input for Phone */}
                        <div>
                          <label htmlFor="phone">Phone</label>
                          <Input
                            id="phone"
                            name="phone"
                            value={editFormData?.phone || ""}
                            onChange={handleEditChange}
                          />
                        </div>

                        {/* Label and Input for Address */}
                        <div>
                          <label htmlFor="address">Address</label>
                          <Input
                            id="address"
                            name="address"
                            value={editFormData?.address || ""}
                            onChange={handleEditChange}
                          />
                        </div>

                        {/* Save and Cancel buttons */}
                        <div className="flex gap-4">
                          <Button onClick={handleSaveChanges}>Save</Button>
                          <Button onClick={() => setEditingCustomer(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
