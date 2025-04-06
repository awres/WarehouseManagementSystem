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
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

export default function RolesPage() {
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [newRole, setNewRole] = useState("");

  const handleAddRole = async () => {
    if (!newRole.trim()) return;

    try {
      const res = await fetch("http://localhost:8000/api/roles/", { // Poprawiony URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role_name: newRole }), // Użycie role_name zamiast name
      });

      if (!res.ok) throw new Error("Failed to add role");

      setNewRole("");  // Wyczyść pole po dodaniu roli
      setIsAddRoleOpen(false);
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-gray-900">Role Management</h1>
        <p className="text-sm text-gray-500">This is the section for managing and adding new roles to the system.</p>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
        <div className="relative flex-1 max-w-sm">
          <Input
            type="search"
            placeholder="Search..."
            className="border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
          />
        </div>

        <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2 bg-black text-white hover:bg-gray-800">
              <Plus className="h-4 w-4" />
              <span>Create New Role</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
              <DialogDescription>Create a new role in the table.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="item-name">Role name</Label>
                <Input
                  id="item-name"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddRoleOpen(false)} className="text-black hover:bg-gray-200">
                Cancel
              </Button>
              <Button onClick={handleAddRole} className="bg-black text-white hover:bg-gray-800">
                Create Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell className="text-right"> {/* Dodanie klasy text-right */} 
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="px-2 py-1">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell className="text-right"> {/* Dodanie klasy text-right */} 
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="px-2 py-1">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
            {/* Dodaj kolejne wiersze w razie potrzeby */}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}