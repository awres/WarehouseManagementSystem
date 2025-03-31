import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function InventorySummary() {
  const inventoryItems = [
    {
      id: 1,
      name: "Product A",
      sku: "SKU-001",
      quantity: 145,
      capacity: 200,
      status: "In Stock",
    },
    {
      id: 2,
      name: "Product B",
      sku: "SKU-002",
      quantity: 23,
      capacity: 150,
      status: "Low Stock",
    },
    {
      id: 3,
      name: "Product C",
      sku: "SKU-003",
      quantity: 67,
      capacity: 100,
      status: "In Stock",
    },
    {
      id: 4,
      name: "Product D",
      sku: "SKU-004",
      quantity: 5,
      capacity: 50,
      status: "Critical",
    },
    {
      id: 5,
      name: "Product E",
      sku: "SKU-005",
      quantity: 89,
      capacity: 100,
      status: "In Stock",
    },
  ];

  return (
    <div className="space-y-4">
      {inventoryItems.map((item) => (
        <div key={item.id} className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.sku}</p>
            </div>
            <Badge
              variant={
                item.status === "In Stock"
                  ? "outline"
                  : item.status === "Low Stock"
                  ? "secondary"
                  : "destructive"
              }
            >
              {item.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Progress
              value={(item.quantity / item.capacity) * 100}
              className="h-2"
            />
            <span className="text-xs text-muted-foreground w-16">
              {item.quantity}/{item.capacity}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
