"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { AlertCircle, Package } from "lucide-react"

interface Product {
  id: number
  name: string
  sku: string
  stock_quantity: string
}

export function InventorySummary() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:8000/get/products/")
        const lastSixProducts = response.data.slice(-6)
        setProducts(lastSixProducts)
        setError(false)
      } catch (error) {
        console.error("Error fetching product data:", error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Status based on stock_quantity
  const getStatus = (quantity: number) => {
    if (quantity > 50) return "In Stock"
    if (quantity > 10) return "Low Stock"
    return "Critical"
  }

  if (loading) {
    return (
      <div className="space-y-2 p-3 rounded-lg border bg-card">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-1"></div>
            <div className="h-2 bg-muted rounded w-full"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg border border-destructive bg-destructive/10 text-destructive flex items-center space-x-3 text-sm">
        <AlertCircle className="h-5 w-5" />
        <p className="font-medium">Failed to load inventory data</p>
      </div>
    )
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

  return (
    <motion.div
      className="space-y-2 p-3 rounded-lg border bg-card"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-center mb-2">
        <Package className="h-4 w-4 mr-2" />
        <h3 className="font-semibold">Inventory Status</h3>
      </div>

      {products.length > 0 ? (
        products.map((product, index) => {
          const stockQuantity = Number.parseInt(product.stock_quantity, 10)
          const status = getStatus(stockQuantity)
          const progressValue = Math.min((stockQuantity / 250) * 100, 100)

          // Background colors based on status
          let itemBg = ""
          let borderColor = ""
          let progressColor = ""

          if (status === "In Stock") {
            itemBg = "bg-emerald-50 dark:bg-emerald-950/20"
            borderColor = "border-emerald-200 dark:border-emerald-800"
            progressColor = "bg-emerald-500"
          } else if (status === "Low Stock") {
            itemBg = "bg-amber-50 dark:bg-amber-950/20"
            borderColor = "border-amber-200 dark:border-amber-800"
            progressColor = "bg-amber-500"
          } else {
            // Critical - stronger red background
            itemBg = "bg-red-100 dark:bg-red-900/30"
            borderColor = "border-red-300 dark:border-red-700"
            progressColor = "bg-red-500"
          }

          return (
            <motion.div
              key={product.id || index}
              className={`flex flex-col space-y-1 p-2 rounded-md border ${itemBg} ${borderColor}`}
              variants={item}
            >
              <div className="flex items-center justify-between">
                <div className="truncate mr-3">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <p className="text-xs text-muted-foreground">{product.sku}</p>
                    <Badge
                      variant={status === "In Stock" ? "outline" : status === "Low Stock" ? "secondary" : "destructive"}
                      className={`text-xs px-2 py-0.5 h-5 ${
                        status === "In Stock"
                          ? "border-emerald-500 text-emerald-700 dark:text-emerald-400"
                          : status === "Low Stock"
                            ? "border-amber-500 text-amber-700 dark:text-amber-400"
                            : ""
                      }`}
                    >
                      {status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center border border-muted-foreground/20 rounded px-2 py-1 bg-background shadow-sm">
                  <span className="text-sm font-medium">{stockQuantity}</span>
                  <span className="text-xs text-muted-foreground ml-1">units</span>
                </div>
              </div>
              <motion.div
                className="relative h-1.5 bg-muted rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className={`absolute top-0 left-0 h-full rounded-full ${progressColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressValue}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </motion.div>
            </motion.div>
          )
        })
      ) : (
        <div className="text-sm text-muted-foreground p-3 border rounded-md">
          <p>No inventory data available.</p>
          <p className="text-xs mt-1">Check your connection or try again later.</p>
        </div>
      )}
    </motion.div>
  )
}

