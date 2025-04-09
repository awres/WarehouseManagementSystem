"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
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
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

type Role = {
  id: number;
  role_name: string;
};

export default function RolesPage() {
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [editRoleName, setEditRoleName] = useState("");
  const [editRoleId, setEditRoleId] = useState<number | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortKey, setSortKey] = useState<"role_name" | "id">("role_name");

  // New state for the delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

  // State for edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Function to fetch roles from API
  const fetchRoles = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/roles/list/");
      if (!res.ok) throw new Error("Failed to fetch roles");

      const data: Role[] = await res.json();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      // For demo purposes, set some sample data if the API call fails
      setRoles([
        { id: 1, role_name: "Admin" },
        { id: 2, role_name: "Manager" },
        { id: 3, role_name: "User" },
        { id: 4, role_name: "Guest" },
      ]);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Function to filter roles based on the search query
  const filteredRoles = roles.filter((role) =>
    role.role_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to add a new role
  const handleAddRole = async () => {
    if (!newRole.trim()) return;

    try {
      const res = await fetch("http://localhost:8000/api/roles/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role_name: newRole }),
      });

      if (!res.ok) throw new Error("Failed to add role");

      const newRoleData: Role = await res.json();
      setRoles((prevRoles) => [...prevRoles, newRoleData]);
      setNewRole(""); // clear the input field
      setIsAddRoleOpen(false); // close the dialog
    } catch (error) {
      console.error("Error adding role:", error);
      // For demo purposes, add a role locally if the API call fails
      const newId =
        roles.length > 0 ? Math.max(...roles.map((r) => r.id)) + 1 : 1;
      const newRoleData = { id: newId, role_name: newRole };
      setRoles((prevRoles) => [...prevRoles, newRoleData]);
      setNewRole("");
      setIsAddRoleOpen(false);
    }
  };

  // Function to edit a role
  const handleEditRole = (roleId: number, roleName: string) => {
    setEditRoleId(roleId);
    setEditRoleName(roleName);
    setIsEditDialogOpen(true); // open the edit dialog
  };

  // Function to save the edited role
  const handleSaveEditRole = async () => {
    if (!editRoleName.trim() || editRoleId === null) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/roles/${editRoleId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role_name: editRoleName }),
        }
      );

      if (!res.ok) throw new Error("Failed to update role");

      const updatedRole = await res.json();
      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          role.id === updatedRole.id
            ? { ...role, role_name: updatedRole.role_name }
            : role
        )
      );
      setEditRoleId(null);
      setEditRoleName(""); // Clear input
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating role:", error);
      // For demo purposes, update the role locally if the API call fails
      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          role.id === editRoleId ? { ...role, role_name: editRoleName } : role
        )
      );
      setEditRoleId(null);
      setEditRoleName("");
      setIsEditDialogOpen(false);
    }
  };

  // Function to handle role deletion
  const handleDeleteRoleDialogOpen = (roleId: number) => {
    setRoleToDelete(roleId);
    setIsDeleteDialogOpen(true);
  };

  // Function to delete a role
  const handleDeleteRole = async () => {
    if (!roleToDelete) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/roles/delete/${roleToDelete}/`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error deleting role:", errorData);
        throw new Error("Failed to delete role");
      }

      setRoles((prevRoles) =>
        prevRoles.filter((role) => role.id !== roleToDelete)
      );
      setIsDeleteDialogOpen(false); // Close the delete dialog
    } catch (error) {
      console.error("Error deleting role:", error);
      // For demo purposes, delete the role locally if the API call fails
      setRoles((prevRoles) =>
        prevRoles.filter((role) => role.id !== roleToDelete)
      );
      setIsDeleteDialogOpen(false);
    }
  };

  // Function to sort roles based on the selected column and direction
  const sortRoles = (roles: Role[]) => {
    return roles.sort((a, b) => {
      if (sortKey === "role_name") {
        const nameA = a.role_name.toLowerCase();
        const nameB = b.role_name.toLowerCase();
        if (nameA < nameB) return sortDirection === "asc" ? -1 : 1;
        if (nameA > nameB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      } else {
        // Sorting by ID
        if (a.id < b.id) return sortDirection === "asc" ? -1 : 1;
        if (a.id > b.id) return sortDirection === "asc" ? 1 : -1;
        return 0;
      }
    });
  };

  // Function to handle sorting option from dropdown
  const handleSortChange = (
    key: "role_name" | "id",
    direction: "asc" | "desc"
  ) => {
    setSortKey(key);
    setSortDirection(direction);
  };

  return (
    <div className="space-y-6">
      <div className="bg-background p-6 rounded-lg shadow-md border">
        <h1 className="text-3xl font-bold">Role Management</h1>
        <p className="text-sm text-muted-foreground">
          This is the section for managing and adding new roles to the system.
        </p>
      </div>

      {/* Mini dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Roles</p>
            <p className="text-3xl font-semibold">{roles.length}</p>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">
              Last Added Role
            </p>
            <p className="text-xl font-medium">
              {roles.length > 0
                ? [...roles].sort((a, b) => b.id - a.id)[0].role_name
                : "None"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search + Add button */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Input
              type="search"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Dropdown + Add button */}
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Sort
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem
                  onClick={() => handleSortChange("role_name", "asc")}
                >
                  Name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("role_name", "desc")}
                >
                  Name (Z-A)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSortChange("id", "asc")}>
                  ID (Low to High)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("id", "desc")}
                >
                  ID (High to Low)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
              open={isAddRoleOpen}
              onOpenChange={(open) => {
                setIsAddRoleOpen(open);
                if (!open) setNewRole(""); // reset the input field on close
              }}
            >
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Create New Role</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Role</DialogTitle>
                  <DialogDescription>
                    Create a new role in the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="role-name">Role name</Label>
                    <Input
                      id="role-name"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddRoleOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddRole}>Create Role</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() =>
                    handleSortChange(
                      "id",
                      sortDirection === "asc" ? "desc" : "asc"
                    )
                  }
                >
                  ID {sortKey === "id" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() =>
                    handleSortChange(
                      "role_name",
                      sortDirection === "asc" ? "desc" : "asc"
                    )
                  }
                >
                  Role Name{" "}
                  {sortKey === "role_name" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortRoles(filteredRoles).map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    #{role.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {role.role_name}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleEditRole(role.id, role.role_name)
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteRoleDialogOpen(role.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setEditRoleId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Edit the role name below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-role-name">Role name</Label>
              <Input
                id="edit-role-name"
                value={editRoleName}
                onChange={(e) => setEditRoleName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEditRole}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => setIsDeleteDialogOpen(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteRole} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
