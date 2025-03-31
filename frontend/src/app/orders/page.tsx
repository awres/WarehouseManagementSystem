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
import { table } from "console";

const URL = "http://localhost:8000/";

export default function OrdersPage() {
	const [searchedValue, setSearchedValue] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [orders, setOrders] = useState<
		{
			id: number;
			customerName: string;
			date: string;
			status: string;
			amount: number;
		}[]
	>([]);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);
	const [formData, setFormData] = useState({
		customerName: "",
		date: "",
		status: "",
		amount: "",
	});

	const fetchOrders = async () => {
		try {
			const res = await axios.get(`${URL}orders/`);
			const ordersData = res.data.map((order: any) => ({
				id: order.id,
				customerName: order.customer_name,
				date: order.order_date,
				status: order.status,
				amount: parseFloat(order.total),
			}));

			setOrders(ordersData);
		} catch (err) {
			console.error("Błąd podczas pobierania zamówień:", err);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async () => {
		try {
			const payload = {
				...formData,
				amount: formData.amount.toString(),
			};

			await axios.post("http://localhost:8000/api/orders/", payload);

			setMessage({ type: "success", text: "złożono zamówienie" });
			setShowModal(false);

			setFormData({
				customerName: "",
				date: "",
				status: "",
				amount: "",
			});

			setTimeout(() => setMessage(null), 3000);
		} catch (error) {
			setMessage({ type: "error", text: "Błąd podczas dodawania produktu." });

			setTimeout(() => setMessage(null), 3000);
		}
	};

	useEffect(() => {
		fetchOrders();
		console.log(orders);
	}, []);

	const filterOrders = () => {
		if (searchedValue.trim() === "") {
			fetchOrders();
			return;
		}

		const filteredOrders = orders.filter((item) =>
			item.customerName
				.trim()
				.toLowerCase()
				.includes(searchedValue.trim().toLowerCase())
		);
		setOrders(filteredOrders);
	};

	useEffect(() => {
		if (searchedValue === "") {
			fetchOrders();
		} else {
			filterOrders();
		}
	}, [searchedValue]);

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
						href="/customers"
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
							href="/customers"
							className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
						>
							<Package className="h-4 w-4" />
							Customers
						</Link>
					</nav>
				</aside>
				<main className="flex-1 p-6 flex flex-col items-center overflow-x-hidden">
					<div className="w-full max-w-4xl text-center">
						<h1 className="text-2xl font-semibold text-gray-800 mb-4">
							Search for Orders
						</h1>
						<div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-md w-full">
							<Search />
							<input
								type="text"
								placeholder="Search..."
								value={searchedValue}
								className="p-2 rounded-md border border-gray-300 flex-1 mx-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
								onChange={(e) => setSearchedValue(e.target.value)}
							/>
							<Button className="mr-4" onClick={() => setShowModal(true)}>
								<Plus className="mr-2 h-4 w-4" />
								Add New Order
							</Button>
						</div>
						<Table className="w-full max-w-4xl">
							<TableHeader>
								<TableRow>
									<TableHead>Order ID</TableHead>
									<TableHead>Customer</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Total</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{orders.length > 0 ? (
									orders.map((item) => (
										<TableRow key={item.id}>
											<TableCell className="font-medium">{item.id}</TableCell>
											<TableCell>{item.customerName}</TableCell>
											<TableCell>{item.date}</TableCell>
											<TableCell>{item.amount}</TableCell>
											<TableCell>
												<Badge
													variant={
														item.status === "Completed"
															? "outline"
															: item.status === "Processing"
															? "secondary"
															: "default"
													}
												>
													{item.status}
												</Badge>
											</TableCell>
											<TableCell className="text-right">
												<Button variant="ghost" size="sm">
													View
												</Button>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={4}
											className="text-center text-gray-500 p-4"
										>
											No orders found
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</main>
			</div>
			{showModal && (
				<div className="fixed inset-0 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-2xl w-96">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-lg font-bold">Add New Item</h2>
							<button onClick={() => setShowModal(false)}>zamknij</button>
						</div>
						<Input
							name="name"
							placeholder="Name"
							value={formData.customerName}
							onChange={handleInputChange}
							className="mb-2"
						/>
						<select
							name="category"
							value={formData.status}
							onChange={handleInputChange}
							className="w-full p-2 border rounded mb-2"
						>
							<option value="">select an option</option>
							<option value="processing">proccesing</option>
							<option value="canceled">canceled</option>
							<option value="pending">pending</option>
							<option value="shipped">shipped</option>
						</select>
						<Input
							name="amount"
							placeholder="amount"
							type="text"
							value={formData.amount}
							onChange={handleInputChange}
							className="mb-2"
						/>
						<Input
							name="stock"
							placeholder="Stock Quantity"
							type="number"
							value={formData.date}
							onChange={handleInputChange}
							className="mb-4"
						/>
						<Button onClick={handleSubmit} className="w-full">
							Submit
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
