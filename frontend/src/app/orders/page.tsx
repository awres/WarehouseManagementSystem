"use client";

import { Package, Search, Filter, Plus, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
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
import axios from "axios";

export default function OrdersPage() {
	const [searched, setSearched] = useState("");
	const [orders, setOrders] = useState<
		{ customerName: string; status: string; amount: number }[]
	>([]);

	const fetchOrders = async () => {
		try {
			await axios.get(`${URL}/orders`).then((res) => {
				const newOrder = {
					customerName: res.data.Customer,
					status: res.data.Status,
					amount: res.data.Total,
				};
				setOrders((prevOrder) => [...prevOrder, newOrder]);
			});
		} catch (err) {
			console.log("blad podczas fe");
		}
	};

	useEffect(() => {
		fetchOrders();
		console.log(orders);
	}, []);

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
						className="font-medium transition-colors hover:text-foreground/80"
					>
						Orders
					</Link>
					<Link
						href="/Customers"
						className="text-muted-foreground transition-colors hover:text-foreground/80"
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
							className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
						>
							<ClipboardList className="h-4 w-4" />
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
								<h1 className="text-3xl font-bold">Orders</h1>
								<p className="text-muted-foreground">Manage customer orders</p>
							</div>
							<Button>
								<Plus className="mr-2 h-4 w-4" />
								New Order
							</Button>
						</div>
						<div className="flex items-center gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Search orders..."
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
										<TableHead>Order ID</TableHead>
										<TableHead>Customer</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Items</TableHead>
										<TableHead>Total</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								{/* <TableBody>
									{orders.map((order) => (
										<TableRow key={order.id}>
											<TableCell className="font-medium">{order.id}</TableCell>
											<TableCell>{order.customer}</TableCell>
											<TableCell>{order.date}</TableCell>
											<TableCell>{order.items}</TableCell>
											<TableCell>{order.total}</TableCell>
											<TableCell>
												<Badge
													variant={
														order.status === "Completed"
															? "outline"
															: order.status === "Processing"
															? "secondary"
															: "default"
													}
												>
													{order.status}
												</Badge>
											</TableCell>
											<TableCell className="text-right">
												<Button variant="ghost" size="sm">
													View
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody> */}
							</Table>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
