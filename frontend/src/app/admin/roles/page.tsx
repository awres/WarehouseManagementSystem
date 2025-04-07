"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
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
    if (!editRoleName.trim()) return;
  
    try {
      const res = await fetch(`http://localhost:8000/api/roles/${editRoleId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role_name: editRoleName }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();  // Log error data from response
        console.error("Error updating role:", errorData);
        throw new Error("Failed to update role");
      }
  
      const updatedRole = await res.json();
      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          role.id === updatedRole.id ? { ...role, role_name: updatedRole.role_name } : role
        )
      );
      setEditRoleId(null);
      setEditRoleName(""); // Clear input
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  // New function to open the delete confirmation dialog
  const handleDeleteRoleDialogOpen = (roleId: number) => {
    setRoleToDelete(roleId);
    setIsDeleteDialogOpen(true);
  };

  // Function to delete a role
  const handleDeleteRole = async () => {
    if (!roleToDelete) return;

    try {
      const res = await fetch(`http://localhost:8000/api/roles/delete/${roleToDelete}/`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error deleting role:", errorData);
        throw new Error("Failed to delete role");
      }

      setRoles((prevRoles) => prevRoles.filter((role) => role.id !== roleToDelete));
      setIsDeleteDialogOpen(false); // Close the delete dialog
    } catch (error) {
      console.error("Error deleting role:", error);
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
    } else { // Sorting by ID
      if (a.id < b.id) return sortDirection === "asc" ? -1 : 1;
      if (a.id > b.id) return sortDirection === "asc" ? 1 : -1;
      return 0;
    }
  });
};



  const handleSort = (key: "role_name" | "id") => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-gray-900">Role Management</h1>
        <p className="text-sm text-gray-500">
          This is the section for managing and adding new roles to the system.
        </p>
      </div>

 {/* Mini dashboard */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="bg-white p-6 rounded-lg shadow-lg border">
    <p className="text-sm text-gray-500 mb-1">Total Roles</p>
    <p className="text-3xl font-semibold">{roles.length}</p>
  </div>
  <div className="bg-white p-6 rounded-lg shadow-lg border">
    <p className="text-sm text-gray-500 mb-1">Last Added Role</p>
    <p className="text-xl font-medium">
      {roles.length > 0
        ? [...roles].sort((a, b) => b.id - a.id)[0].role_name
        : "None"}
    </p>
  </div>
</div>


{/* Search + Add button */}
<div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mt-4">
  <div className="relative flex-1 max-w-sm">
    <Input
      type="search"
      placeholder="Search roles..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="border-gray-300 shadow-sm rounded-md"
    />
  </div>


        <Dialog
          open={isAddRoleOpen}
          onOpenChange={(open) => {
            setIsAddRoleOpen(open);
            if (!open) setNewRole(""); // reset the input field on close
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2 bg-black text-white hover:bg-gray-800">
              <Plus className="h-4 w-4" />
              <span>Create New Role</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
              <DialogDescription>Create a new role in the system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="role-name">Role name</Label>
                <Input
                  id="role-name"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="border-gray-300 shadow-sm rounded-md"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddRoleOpen(false)}
                className="text-black hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button onClick={handleAddRole} className="bg-black text-white hover:bg-gray-800">
                Create Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead
          className="text-left font-semibold text-gray-700 cursor-pointer py-3 px-4 hover:bg-gray-100 transition-colors duration-300"
          onClick={() => handleSort("id")}
        >
          ID {sortKey === "id" && (sortDirection === "asc" ? "↑" : "↓")}
        </TableHead>
        <TableHead
          className="text-left font-semibold text-gray-700 cursor-pointer py-3 px-4 hover:bg-gray-100 transition-colors duration-300"
          onClick={() => handleSort("role_name")}
        >
          Role Name {sortKey === "role_name" && (sortDirection === "asc" ? "↑" : "↓")}
        </TableHead>
        <TableHead className="text-right font-semibold text-gray-700 py-3 px-4">
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      {sortRoles(filteredRoles).map((role) => (
        <TableRow key={role.id} className="hover:bg-gray-50 transition-colors duration-300">
          <TableCell className="font-mono text-xs bg-muted px-4 py-2 rounded">
            #{role.id}
          </TableCell>
          <TableCell className="font-medium py-3 px-4">{role.role_name}</TableCell>
          <TableCell className="text-right py-3 px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                  <MoreHorizontal className="h-5 w-5 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEditRole(role.id, role.role_name)}>
                  <Edit className="mr-2 h-4 w-4 text-gray-600" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteRoleDialogOpen(role.id)}>
                  <Trash2 className="mr-2 h-4 w-4 text-red-600" />
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
      <Dialog open={editRoleId !== null} onOpenChange={(open) => setEditRoleId(open ? editRoleId : null)}>
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
          className="border-gray-300 shadow-sm rounded-md"
        />
      </div>
    </div>
    <DialogFooter>
      <Button
        variant="outline"
        onClick={() => setEditRoleId(null)}
        className="text-black hover:bg-gray-200"
      >
        Cancel
      </Button>
      <Button onClick={handleSaveEditRole} className="bg-black text-white hover:bg-gray-800">
        Save Changes
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


      {/* Delete Role Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => setIsDeleteDialogOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>Are you sure you want to delete this role?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="text-black hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteRole} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
