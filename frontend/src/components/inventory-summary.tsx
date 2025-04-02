"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Package2, AlertTriangle, AlertCircle } from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string;
  stock_quantity: string;
}

export function InventorySummary() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get/products/");
        console.log(response.data);
        const lastFiveProducts = response.data.slice(-4);
        setProducts(lastFiveProducts);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Status na podstawie stock_quantity
  const getStatus = (quantity: number) => {
    if (quantity > 50) return "In Stock";
    if (quantity > 10) return "Low Stock";
    return "Critical";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Package2 className="h-4 w-4 text-green-500" />;
      case "Low Stock":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "Critical":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 bg-muted/20 rounded-lg border border-border/50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted-foreground/30 border-t-muted-foreground"></div>
          <p className="text-sm text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card p-1">
      {products.length > 0 ? (
        products.map((product, index) => {
          const stockQuantity = Number.parseInt(product.stock_quantity, 10);
          const status = getStatus(stockQuantity);
          const progressValue = Math.min((stockQuantity / 250) * 100, 100);
          const statusIcon = getStatusIcon(status);

          return (
            <div
              key={product.id || index}
              className={`rounded-md p-3 transition-colors ${
                index !== products.length - 1 ? "border-b" : ""
              } hover:bg-muted/50`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium line-clamp-1">{product.name}</h3>
                    <Badge
                      variant={
                        status === "In Stock"
                          ? "outline"
                          : status === "Low Stock"
                          ? "secondary"
                          : "destructive"
                      }
                      className="ml-2"
                    >
                      <span className="flex items-center gap-1">
                        {statusIcon}
                        {status}
                      </span>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    SKU: {product.sku}
                  </p>
                </div>
                <div className="text-sm font-medium">{stockQuantity} units</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Progress
                    value={progressValue}
                    className={`h-2 ${
                      status === "Critical"
                        ? "bg-red-100"
                        : status === "Low Stock"
                        ? "bg-amber-100"
                        : "bg-green-100"
                    }`}
                  />
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">
                  {progressValue.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <Package2 className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No inventory data available</p>
        </div>
      )}
    </div>
  );
}
