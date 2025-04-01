"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const URL = "http://localhost:8000/";

interface Order {
  id: number;
  customer_id?: number;
  customer_name?: string;
  order_date: string;
  status: string;
  amount: number;
  total: number | string;
}

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "yyyy/MM/dd HH:mm");
};

export function RecentOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Record<number, Customer>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/get/customers/");
      const customersMap: Record<number, Customer> = {};

      res.data.forEach((customer: Customer) => {
        customersMap[customer.id] = customer;
      });

      setCustomers(customersMap);
      return customersMap;
    } catch (err) {
      console.error("Error fetching customers:", err);
      return {};
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const customersMap = await fetchCustomers();
      const res = await axios.get("http://localhost:8000/get/orders/");

      const ordersData = res.data
        .map((order: any) => {
          const customer = customersMap[order.customer_id];
          const customerName = customer
            ? `${customer.first_name} ${customer.last_name}`
            : `Customer #${order.customer_id || "Unknown"}`;

          return {
            id: order.id,
            customer_name: customerName,
            order_date: order.order_date
              ? formatDate(order.order_date)
              : "No date",
            status: order.status || "Pending",
            amount:
              typeof order.total === "number"
                ? order.total
                : Number.parseFloat(order.total || "0"),
          };
        })
        .slice(-5); // Get only the last 5 orders

      setOrders(ordersData);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to fetch orders");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "outline";
      case "processing":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleViewOrder = (orderId: number) => {
    router.push(`/orders`);
  };

  if (loading) {
    return (
      <Card className="h-full">
        <div className="px-6 pb-4">
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="px-6 pb-4">
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">Order #{order.id}</div>
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="font-medium">{order.customer_name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <CalendarIcon className="h-3 w-3" />
                    {order.order_date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    $
                    {typeof order.amount === "number"
                      ? order.amount.toFixed(2)
                      : "0.00"}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 h-7 px-2"
                    onClick={() => handleViewOrder(order.id)}
                  >
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
