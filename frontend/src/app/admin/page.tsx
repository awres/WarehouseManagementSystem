import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Users, ShoppingCart, AlertTriangle } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the warehouse management admin panel
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">
              142 added this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">432</div>
            <p className="text-xs text-muted-foreground">56 processed today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">2 critical issues</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <p className="text-sm font-medium">
                  User john.doe updated inventory
                </p>
                <p className="text-xs text-muted-foreground">Today at 14:32</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium">
                  New order #ORD-7899 received
                </p>
                <p className="text-xs text-muted-foreground">Today at 13:17</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium">
                  User admin.user added new product
                </p>
                <p className="text-xs text-muted-foreground">Today at 11:43</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium">System backup completed</p>
                <p className="text-xs text-muted-foreground">Today at 04:00</p>
              </div>
              <div>
                <p className="text-sm font-medium">User jane.smith logged in</p>
                <p className="text-xs text-muted-foreground">
                  Yesterday at 19:23
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Server Uptime</p>
                  <p className="text-xs text-muted-foreground">
                    Last restart: 32 days ago
                  </p>
                </div>
                <span className="flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Database Connection</p>
                  <p className="text-xs text-muted-foreground">
                    Response time: 45ms
                  </p>
                </div>
                <span className="flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">API Services</p>
                  <p className="text-xs text-muted-foreground">
                    All endpoints operational
                  </p>
                </div>
                <span className="flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Storage Usage</p>
                  <p className="text-xs text-muted-foreground">
                    68% of 500GB used
                  </p>
                </div>
                <span className="flex h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Backup System</p>
                  <p className="text-xs text-muted-foreground">
                    Last backup: 8 hours ago
                  </p>
                </div>
                <span className="flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
