"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Product {
  id: number;
  name: string;
  sku: string;
  stock_quantity: string;
}

export function InventorySummary() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get/products/");
        console.log(response.data);
        const lastFiveProducts = response.data.slice(-5);
        setProducts(lastFiveProducts);
      } catch (error) {
        console.error("Error fetching product data:", error);
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

  return (
    <div className="space-y-4">
      {products.length > 0 ? (
        products.map((product, index) => {
          const stockQuantity = parseInt(product.stock_quantity, 10); // Zamieniamy na liczbę całkowitą
          const status = getStatus(stockQuantity);
          const progressValue = Math.min((stockQuantity / 250) * 100, 100); // Maks 100%

          return (
            <div key={product.id || index} className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.sku}</p>
                </div>
                <Badge
                  variant={
                    status === "In Stock"
                      ? "outline"
                      : status === "Low Stock"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={progressValue} className="h-2" />
                <span className="text-xs text-muted-foreground w-16">
                  {stockQuantity}
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-sm text-muted-foreground">Loading inventory...</p>
      )}
    </div>
  );
}
