// API base URL - adjust this to match your Django backend URL
const API_BASE_URL = "http://localhost:8000";

// Types based on your Django models
export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock_quantity: number;
  barcode: string;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  customer: Customer;
  order_date: string;
  status: string;
  total: number;
}

export interface OrderItem {
  id: number;
  order: number;
  product: number;
  quantity: number;
  price: number;
}

export interface Return {
  id: number;
  order_item: number;
  return_date: string;
  status: string;
  notes: string;
}

// API functions
export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/get/products/`);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

export async function getOrders(): Promise<Order[]> {
  const response = await fetch(`${API_BASE_URL}/get/orders/`);
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
}

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch(`${API_BASE_URL}/get/customers/`);
  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }
  return response.json();
}

export async function getReturns(): Promise<Return[]> {
  const response = await fetch(`${API_BASE_URL}/get/returns/`);
  if (!response.ok) {
    throw new Error("Failed to fetch returns");
  }
  return response.json();
}

export async function getOrderItems(): Promise<OrderItem[]> {
  const response = await fetch(`${API_BASE_URL}/get/orderitems/`);
  if (!response.ok) {
    throw new Error("Failed to fetch order items");
  }
  return response.json();
}

// Analytics helper functions
// Fix the getSalesData function to properly handle sales data from orders
export async function getSalesData(
  timeframe: string
): Promise<{ date: string; sales: number }[]> {
  const orders = await getOrders();

  // Determine the start date based on the timeframe
  const now = new Date();
  const startDate = new Date();

  switch (timeframe) {
    case "7days":
      startDate.setDate(now.getDate() - 7);
      break;
    case "30days":
      startDate.setDate(now.getDate() - 30);
      break;
    case "90days":
      startDate.setDate(now.getDate() - 90);
      break;
    case "year":
      startDate.setDate(now.getDate() - 365);
      break;
  }

  // Filter orders by date and group by day
  const salesByDay = new Map<string, number>();

  orders.forEach((order) => {
    // Make sure we have a valid date and total
    if (order.order_date && order.total !== null && order.total !== undefined) {
      const orderDate = new Date(order.order_date);
      if (orderDate >= startDate) {
        const dateKey = orderDate.toISOString().split("T")[0];
        const currentTotal = salesByDay.get(dateKey) || 0;
        salesByDay.set(dateKey, currentTotal + Number(order.total));
      }
    }
  });

  // Fill in missing dates with zero sales
  const result: { date: string; sales: number }[] = [];
  const dateIterator = new Date(startDate);

  while (dateIterator <= now) {
    const dateKey = dateIterator.toISOString().split("T")[0];
    result.push({
      date: dateKey,
      sales: salesByDay.get(dateKey) || 0,
    });
    dateIterator.setDate(dateIterator.getDate() + 1);
  }

  return result;
}

// Fix the getAnalyticsSummary function to properly handle sales calculations
export async function getAnalyticsSummary(timeframe: string): Promise<{
  totalSales: number;
  orderCount: number;
  returnCount: number;
  salesGrowth: number;
  orderGrowth: number;
  returnGrowth: number;
}> {
  const [orders, returns] = await Promise.all([getOrders(), getReturns()]);

  // Determine the start date based on the timeframe
  const now = new Date();
  const currentPeriodStart = new Date();
  const previousPeriodStart = new Date();

  switch (timeframe) {
    case "7days":
      currentPeriodStart.setDate(now.getDate() - 7);
      previousPeriodStart.setDate(now.getDate() - 14);
      break;
    case "30days":
      currentPeriodStart.setDate(now.getDate() - 30);
      previousPeriodStart.setDate(now.getDate() - 60);
      break;
    case "90days":
      currentPeriodStart.setDate(now.getDate() - 90);
      previousPeriodStart.setDate(now.getDate() - 180);
      break;
    case "year":
      currentPeriodStart.setDate(now.getDate() - 365);
      previousPeriodStart.setDate(now.getDate() - 730);
      break;
  }

  // Filter current period data
  const currentPeriodOrders = orders.filter((order) => {
    if (!order.order_date) return false;
    return new Date(order.order_date) >= currentPeriodStart;
  });

  const currentPeriodReturns = returns.filter((ret) => {
    if (!ret.return_date) return false;
    return new Date(ret.return_date) >= currentPeriodStart;
  });

  // Filter previous period data
  const previousPeriodOrders = orders.filter((order) => {
    if (!order.order_date) return false;
    const orderDate = new Date(order.order_date);
    return orderDate >= previousPeriodStart && orderDate < currentPeriodStart;
  });

  const previousPeriodReturns = returns.filter((ret) => {
    if (!ret.return_date) return false;
    const returnDate = new Date(ret.return_date);
    return returnDate >= previousPeriodStart && returnDate < currentPeriodStart;
  });

  // Calculate totals with proper type handling
  const currentTotalSales = currentPeriodOrders.reduce((sum, order) => {
    const orderTotal =
      order.total !== null && order.total !== undefined
        ? Number(order.total)
        : 0;
    return sum + orderTotal;
  }, 0);

  const previousTotalSales = previousPeriodOrders.reduce((sum, order) => {
    const orderTotal =
      order.total !== null && order.total !== undefined
        ? Number(order.total)
        : 0;
    return sum + orderTotal;
  }, 0);

  // Calculate growth rates
  const salesGrowth =
    previousTotalSales === 0
      ? 100
      : ((currentTotalSales - previousTotalSales) / previousTotalSales) * 100;

  const orderGrowth =
    previousPeriodOrders.length === 0
      ? 100
      : ((currentPeriodOrders.length - previousPeriodOrders.length) /
          previousPeriodOrders.length) *
        100;

  const returnGrowth =
    previousPeriodReturns.length === 0
      ? 0
      : ((currentPeriodReturns.length - previousPeriodReturns.length) /
          previousPeriodReturns.length) *
        100;

  return {
    totalSales: currentTotalSales,
    orderCount: currentPeriodOrders.length,
    returnCount: currentPeriodReturns.length,
    salesGrowth,
    orderGrowth,
    returnGrowth,
  };
}

function parseFloatWithComma(value: string | number): number {
  if (typeof value === "number") return value; // Jeśli to już liczba, zwracamy ją bez zmian
  if (typeof value === "string") {
    return parseFloat(value.replace(",", ".")); // Zamiana przecinka na kropkę
  }
  return 0; // Domyślnie 0, jeśli wartość nie jest poprawna
}

export async function getPriceChangeImpactData(): Promise<
  {
    name: string;
    beforePrice: number;
    afterPrice: number;
    beforeSales: number;
    afterSales: number;
  }[]
> {
  const [products, orderItems] = await Promise.all([
    getProducts(),
    getOrderItems(),
  ]);

  const productSales = new Map<number, number>();

  orderItems.forEach((item) => {
    const currentCount = productSales.get(item.product) || 0;
    productSales.set(
      item.product,
      currentCount + parseFloatWithComma(item.quantity)
    );
  });

  const topProductIds = [...productSales.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((entry) => entry[0]);

  const topProducts = products.filter((product) =>
    topProductIds.includes(product.id)
  );

  return topProducts.map((product) => {
    const originalPrice = parseFloatWithComma(product.price);
    const discountedPrice = originalPrice * 0.8;

    const originalSales = parseFloatWithComma(
      productSales.get(product.id) || 0
    );
    const estimatedSalesIncrease = originalSales ? originalSales * 1.7 : 0;

    return {
      name: product.name,
      beforePrice: originalPrice,
      afterPrice: discountedPrice,
      beforeSales: originalSales,
      afterSales: estimatedSalesIncrease,
    };
  });
}

export async function getTopProducts(): Promise<
  {
    id: number;
    name: string;
    category: string;
    sales: number;
    revenue: number;
    trend: string;
  }[]
> {
  const [products, orderItems] = await Promise.all([
    getProducts(),
    getOrderItems(),
  ]);

  // Calculate sales and revenue by product
  const productStats = new Map<number, { sales: number; revenue: number }>();

  orderItems.forEach((item) => {
    const stats = productStats.get(item.product) || { sales: 0, revenue: 0 };
    stats.sales += item.quantity;
    stats.revenue += item.price * item.quantity;
    productStats.set(item.product, stats);
  });

  // Create the top products list
  const topProducts = products
    .filter((product) => productStats.has(product.id))
    .map((product) => {
      const stats = productStats.get(product.id) || { sales: 0, revenue: 0 };
      return {
        id: product.id,
        name: product.name,
        category: product.category || "Uncategorized",
        sales: stats.sales,
        revenue: stats.revenue,
        trend: "up", // In a real app, you would compare with previous period
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return topProducts;
}
