import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RecentOrders() {
	const orders = [
		{
			id: "ORD-7891",
			customer: "Acme Inc.",
			date: "2023-04-23",
			status: "Processing",
			items: 7,
		},
		{
			id: "ORD-7892",
			customer: "TechCorp",
			date: "2023-04-23",
			status: "Pending",
			items: 3,
		},
		{
			id: "ORD-7893",
			customer: "Global Supplies",
			date: "2023-04-22",
			status: "Processing",
			items: 12,
		},
		{
			id: "ORD-7894",
			customer: "Local Shop",
			date: "2023-04-22",
			status: "Completed",
			items: 2,
		},
	];

	return (
		<div className="space-y-4">
			{orders.map((order) => (
				<div
					key={order.id}
					className="flex items-center justify-between border-b pb-4"
				>
					<div>
						<p className="font-medium">{order.id}</p>
						<p className="text-sm text-muted-foreground">{order.customer}</p>
						<div className="flex items-center gap-2 mt-1">
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
							<span className="text-xs text-muted-foreground">
								{order.date}
							</span>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<div className="text-sm text-right">
							<p>{order.items} items</p>
						</div>
						<Button size="sm" variant="outline">
							View
						</Button>
					</div>
				</div>
			))}
		</div>
	);
}
