"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { format } from "date-fns"
import {
  CalendarIcon,
  CheckCircle2Icon,
  Clock3Icon,
  PackageIcon,
  ShieldAlertIcon,
  TruckIcon,
  UserIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const URL = "http://localhost:8000/"

interface Order {
  id: number
  customer_name: string
  order_date: string
  status: string
  amount: number
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return format(date, "yyyy/MM/dd HH:mm")
}

export function RecentOrders() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:8000/get/orders/")

      const ordersData = res.data
        .map((order: any) => ({
          id: order.id,
          customer_name: order.customer
            ? `${order.customer.first_name} ${order.customer.last_name}`
            : "Unknown Customer",
          order_date: order.order_date ? formatDate(order.order_date) : "No date",
          status: order.status || "Pending",
          amount: typeof order.total === "number" ? order.total : Number.parseFloat(order.total || "0"),
        }))
        .slice(-5) // Get only the last 5 orders

      setOrders(ordersData)
      setLoading(false)
    } catch (err: any) {
      console.error("Error fetching orders:", err)
      setError(err.message || "Failed to fetch orders")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case "completed":
        return {
          color: "bg-gradient-to-r from-emerald-500 to-green-500 text-white",
          icon: <CheckCircle2Icon className="h-3.5 w-3.5" />,
          shadowColor: "shadow-emerald-500/20",
        }
      case "processing":
        return {
          color: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
          icon: <Clock3Icon className="h-3.5 w-3.5" />,
          shadowColor: "shadow-blue-500/20",
        }
      case "cancelled":
        return {
          color: "bg-gradient-to-r from-red-500 to-rose-500 text-white",
          icon: <ShieldAlertIcon className="h-3.5 w-3.5" />,
          shadowColor: "shadow-red-500/20",
        }
      case "shipped":
        return {
          color: "bg-gradient-to-r from-violet-500 to-purple-500 text-white",
          icon: <TruckIcon className="h-3.5 w-3.5" />,
          shadowColor: "shadow-purple-500/20",
        }
      default:
        return {
          color: "bg-gradient-to-r from-gray-500 to-slate-500 text-white",
          icon: <Clock3Icon className="h-3.5 w-3.5" />,
          shadowColor: "shadow-gray-500/20",
        }
    }
  }

  const MotionCard = motion(Card)

  if (loading) {
    return (
      <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center gap-2">
            <PackageIcon className="h-5 w-5 text-primary" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <div className="px-6 pb-4">
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-md bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20 bg-primary/10" />
                        <Skeleton className="h-4 w-40 bg-primary/5" />
                      </div>
                      <div>
                        <Skeleton className="h-8 w-20 bg-primary/10 rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center gap-2">
            <PackageIcon className="h-5 w-5 text-primary" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground gap-4">
            <ShieldAlertIcon className="h-12 w-12 text-red-500/70" />
            <p className="text-center">Error loading orders: {error}</p>
            <Button
              variant="outline"
              onClick={fetchOrders}
              className="mt-2 border-primary/20 text-primary hover:bg-primary/10"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent flex items-center gap-2">
          <PackageIcon className="h-5 w-5 text-primary" />
          Recent Orders
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground gap-2">
            <PackageIcon className="h-10 w-10 text-muted-foreground/50" />
            <p>No recent orders found</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
            {orders.map((order, index) => {
              const statusConfig = getStatusConfig(order.status)

              return (
                <MotionCard
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className={cn(
                    "overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm",
                    statusConfig.shadowColor,
                  )}
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-medium text-sm flex items-center gap-2">
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold"
                        >
                          #{order.id}
                        </motion.span>
                        <span className="text-muted-foreground">Order</span>
                      </div>
                      <Badge
                        className={cn(
                          statusConfig.color,
                          "font-medium px-3 py-1 text-xs rounded-full shadow-sm flex items-center gap-1.5",
                        )}
                      >
                        {statusConfig.icon}
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 shrink-0">
                          <UserIcon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                            <CalendarIcon className="h-3 w-3" />
                            {order.order_date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5"
                        >
                          <p className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            ${order.amount.toFixed(2)}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </MotionCard>
              )
            })}
          </div>
        )}
      </div>
    </Card>
  )
}

