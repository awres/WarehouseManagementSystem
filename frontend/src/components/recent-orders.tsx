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
  UserIcon,
  DollarSign,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
        .slice(-5)

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
    if (statusLower === "shipped" || statusLower === "completed") {
      return {
        bg: "",
        border: "border-emerald-200 dark:border-emerald-800",
        badge: "bg-gradient-to-r from-emerald-500 to-green-500 text-white",
        icon: <CheckCircle2Icon className="h-3.5 w-3.5" />,
        progressColor: "bg-gradient-to-r from-emerald-500 to-green-500",
        iconColor: "text-emerald-600 dark:text-emerald-400",
      }
    } else if (statusLower === "cancelled") {
      return {
        bg: "",
        border: "border-red-200 dark:border-red-800",
        badge: "bg-gradient-to-r from-red-500 to-rose-500 text-white",
        icon: <ShieldAlertIcon className="h-3.5 w-3.5" />,
        progressColor: "bg-gradient-to-r from-red-500 to-rose-500",
        iconColor: "text-red-600 dark:text-red-400",
      }
    } else if (statusLower === "processing") {
      return {
        bg: "",
        border: "border-yellow-200 dark:border-yellow-800",
        badge: "bg-gradient-to-r from-yellow-500 to-amber-500 text-white",
        icon: <Clock3Icon className="h-3.5 w-3.5" />,
        progressColor: "bg-gradient-to-r from-yellow-500 to-amber-500",
        iconColor: "text-yellow-600 dark:text-yellow-400",
      }
    } else {
      return {
        bg: "",
        border: "border-blue-200 dark:border-blue-800",
        badge: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white",
        icon: <Clock3Icon className="h-3.5 w-3.5" />,
        progressColor: "bg-gradient-to-r from-blue-500 to-indigo-500",
        iconColor: "text-blue-600 dark:text-blue-400",
      }
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { y: 10, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  if (loading) {
    return (
      <div className="space-y-2 p-3 rounded-lg border-0 shadow-lg bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm">
        <div className="flex items-center mb-2">
          <PackageIcon className="h-4 w-4 mr-2 text-primary" />
          <h3 className="font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Recent Orders
          </h3>
        </div>

        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="overflow-hidden border-0 shadow-md bg-card/50 backdrop-blur-sm rounded-lg p-2"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32 bg-primary/5" />
              <Skeleton className="h-6 w-16 bg-primary/10 rounded-full" />
            </div>
            <Skeleton className="h-1.5 w-full mt-2 bg-primary/5 rounded-full" />
          </motion.div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-3 rounded-lg border-0 shadow-lg bg-gradient-to-br from-background to-red-50/30 dark:from-background dark:to-red-950/10 backdrop-blur-sm">
        <div className="flex items-center mb-2">
          <PackageIcon className="h-4 w-4 mr-2 text-primary" />
          <h3 className="font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Recent Orders
          </h3>
        </div>

        <div className="flex items-center justify-center h-[100px] text-muted-foreground gap-2">
          <ShieldAlertIcon className="h-6 w-6 text-red-500/70" />
          <p className="text-center text-sm">Error loading orders</p>
          <Button
            variant="outline"
            onClick={fetchOrders}
            className="ml-2 border-primary/20 text-primary hover:bg-primary/10"
            size="sm"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-2 p-3 rounded-lg border-0 shadow-lg bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-center mb-2">
        <PackageIcon className="h-4 w-4 mr-2 text-primary" />
        <h3 className="font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Recent Orders
        </h3>
      </div>

      {orders.length === 0 ? (
        <div className="flex items-center justify-center h-[80px] text-muted-foreground">
          <p className="text-sm">No recent orders found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order, index) => {
            const statusConfig = getStatusConfig(order.status)

            return (
              <motion.div
                key={order.id}
                className={cn(
                  "rounded-lg border-0 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300",
                  statusConfig.bg,
                )}
                variants={item}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                <div className="p-2.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 shrink-0",
                        )}
                      >
                        <UserIcon className={cn("h-3.5 w-3.5", statusConfig.iconColor)} />
                      </div>
                      <div>
                        <p className="font-medium text-sm truncate max-w-[120px]">{order.customer_name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-0.5 mt-0.5">
                          <CalendarIcon className="h-3 w-3" />
                          {order.order_date}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge
                        className={cn(
                          statusConfig.badge,
                          "font-medium px-2 py-0.5 text-xs rounded-full shadow-sm flex items-center gap-1 mb-1",
                        )}
                      >
                        {statusConfig.icon}
                        {order.status}
                      </Badge>
                      <p className="text-sm font-semibold flex items-center">
                        <DollarSign className="h-3 w-3 mr-0.5" />
                        {order.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <motion.div
                    className="relative h-1.5 bg-muted/50 rounded-full overflow-hidden mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      className={`absolute top-0 left-0 h-full rounded-full ${statusConfig.progressColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

