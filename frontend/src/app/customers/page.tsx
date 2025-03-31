"use client";
import { Package, Search, Filter, Plus, ClipboardList } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";

const URL = "http://localhost:8000/";

const customers = () => {
	const [searchedValue, setSearchedValue] = useState("");
	const [customers, setCustomers] = useState([]);

	const fetchData = async () => {
		await axios.get(`${URL}/customers`).then((res) => {
			const newCustomer = {
				id: res.data.id,
				name: res.data.first_name + res.data.last_name,
				email: res.data.email,
				phone: res.data.phone,
			};

			// setCustomers();
		});
	};

	return (
		<>
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
							className="font-medium transition-colors hover:text-foreground/80"
						>
							Customers
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
								<Package className="h-4 w-4" />
								Customers
							</Link>
						</nav>
					</aside>
					<main className="flex-1 p-6 flex flex-col items-center">
						<div className="w-full max-w-md text-center">
							<h1 className="text-2xl font-semibold text-gray-800 mb-4">
								Search for Customers
							</h1>
							<div className="flex items-center justify-center space-x-4 bg-white p-3 rounded-lg shadow-md">
								<Search />
								<input
									type="text"
									placeholder="Search..."
									value={searchedValue}
									className="pl-3 p-2 rounded-md border border-gray-300 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
									onChange={(e) => setSearchedValue(e.target.value)}
								/>
							</div>
						</div>
					</main>
				</div>
			</div>
		</>
	);
};

export default customers;
