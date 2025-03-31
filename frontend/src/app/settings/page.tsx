import Link from "next/link";
import {
  Package,
  Truck,
  ClipboardList,
  BarChart3,
  Settings,
  Save,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <div className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6" />
          <span>WarehouseOS</span>
        </div>
        <nav className="hidden flex-1 items-center gap-6 text-sm md:flex">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground/80"
          >
            Dashboard
          </Link>
          <Link
            href="/inventory"
            className="text-muted-foreground transition-colors hover:text-foreground/80"
          >
            Inventory
          </Link>
          <Link
            href="/orders"
            className="text-muted-foreground transition-colors hover:text-foreground/80"
          >
            Orders
          </Link>
          <Link
            href="/customers"
            className="text-muted-foreground transition-colors hover:text-foreground/80"
          >
            Customers
          </Link>
          <Link
            href="/reports"
            className="text-muted-foreground transition-colors hover:text-foreground/80"
          >
            Reports
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="link" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <nav className="grid gap-2 p-4 text-sm">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/inventory"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Package className="h-4 w-4" />
              Inventory
            </Link>
            <Link
              href="/orders"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <ClipboardList className="h-4 w-4" />
              Orders
            </Link>
            <Link
              href="/customers"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Truck className="h-4 w-4" />
              Customers
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2 text-primary-foreground"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Configure your warehouse management system
              </p>
            </div>

            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>
                      Update your company details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input
                          id="company-name"
                          defaultValue="Acme Logistics"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Contact Email</Label>
                        <Input
                          id="contact-email"
                          defaultValue="contact@acmelogistics.com"
                          type="email"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="+1 (555) 123-4567" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select defaultValue="utc-8">
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="utc-12">UTC-12:00</SelectItem>
                            <SelectItem value="utc-11">UTC-11:00</SelectItem>
                            <SelectItem value="utc-10">UTC-10:00</SelectItem>
                            <SelectItem value="utc-9">UTC-09:00</SelectItem>
                            <SelectItem value="utc-8">
                              UTC-08:00 (PST)
                            </SelectItem>
                            <SelectItem value="utc-7">
                              UTC-07:00 (MST)
                            </SelectItem>
                            <SelectItem value="utc-6">
                              UTC-06:00 (CST)
                            </SelectItem>
                            <SelectItem value="utc-5">
                              UTC-05:00 (EST)
                            </SelectItem>
                            <SelectItem value="utc-4">UTC-04:00</SelectItem>
                            <SelectItem value="utc-3">UTC-03:00</SelectItem>
                            <SelectItem value="utc-2">UTC-02:00</SelectItem>
                            <SelectItem value="utc-1">UTC-01:00</SelectItem>
                            <SelectItem value="utc">UTC±00:00</SelectItem>
                            <SelectItem value="utc+1">
                              UTC+01:00 (CET)
                            </SelectItem>
                            <SelectItem value="utc+2">
                              UTC+02:00 (EET)
                            </SelectItem>
                            <SelectItem value="utc+3">UTC+03:00</SelectItem>
                            <SelectItem value="utc+4">UTC+04:00</SelectItem>
                            <SelectItem value="utc+5">UTC+05:00</SelectItem>
                            <SelectItem value="utc+5.5">
                              UTC+05:30 (IST)
                            </SelectItem>
                            <SelectItem value="utc+6">UTC+06:00</SelectItem>
                            <SelectItem value="utc+7">UTC+07:00</SelectItem>
                            <SelectItem value="utc+8">
                              UTC+08:00 (CST)
                            </SelectItem>
                            <SelectItem value="utc+9">
                              UTC+09:00 (JST)
                            </SelectItem>
                            <SelectItem value="utc+10">UTC+10:00</SelectItem>
                            <SelectItem value="utc+11">UTC+11:00</SelectItem>
                            <SelectItem value="utc+12">UTC+12:00</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Business Address</Label>
                      <Input
                        id="address"
                        defaultValue="123 Warehouse Ave, Logistics Park"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Preferences</CardTitle>
                    <CardDescription>
                      Configure system-wide settings and defaults
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currency">Default Currency</Label>
                        <Select defaultValue="usd">
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                            <SelectItem value="gbp">GBP (£)</SelectItem>
                            <SelectItem value="jpy">JPY (¥)</SelectItem>
                            <SelectItem value="cad">CAD ($)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="units">Measurement Units</Label>
                        <Select defaultValue="imperial">
                          <SelectTrigger id="units">
                            <SelectValue placeholder="Select units" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="metric">
                              Metric (kg, cm)
                            </SelectItem>
                            <SelectItem value="imperial">
                              Imperial (lb, in)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-reorder">
                          Automatic Reordering
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically create purchase orders when inventory is
                          low
                        </p>
                      </div>
                      <Switch id="auto-reorder" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="barcode-scanning">
                          Enable Barcode Scanning
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Use barcode scanners for inventory management
                        </p>
                      </div>
                      <Switch id="barcode-scanning" defaultChecked />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage user accounts and permissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">User Roles</h3>
                        <p className="text-sm text-muted-foreground">
                          Configure access levels and permissions for different
                          user roles
                        </p>
                      </div>
                      <Button variant="outline">Manage Roles</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">User Accounts</h3>
                        <p className="text-sm text-muted-foreground">
                          Add, edit, or deactivate user accounts
                        </p>
                      </div>
                      <Button variant="outline">Manage Users</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">Activity Logs</h3>
                        <p className="text-sm text-muted-foreground">
                          View user activity and system logs
                        </p>
                      </div>
                      <Button variant="outline">View Logs</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Authentication Settings</CardTitle>
                    <CardDescription>
                      Configure authentication methods and security policies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor">
                          Two-Factor Authentication
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Require two-factor authentication for all users
                        </p>
                      </div>
                      <Switch id="two-factor" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="password-policy">
                          Strong Password Policy
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Enforce complex passwords and regular password changes
                        </p>
                      </div>
                      <Switch id="password-policy" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">
                        Session Timeout (minutes)
                      </Label>
                      <Input
                        id="session-timeout"
                        type="number"
                        defaultValue="30"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="warehouses" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Warehouse Locations</CardTitle>
                    <CardDescription>
                      Manage your warehouse locations and zones
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">Warehouse Facilities</h3>
                        <p className="text-sm text-muted-foreground">
                          Add and manage warehouse facilities and locations
                        </p>
                      </div>
                      <Button variant="outline">Manage Facilities</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">Storage Zones</h3>
                        <p className="text-sm text-muted-foreground">
                          Configure storage zones, aisles, and bin locations
                        </p>
                      </div>
                      <Button variant="outline">Configure Zones</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">Dock Management</h3>
                        <p className="text-sm text-muted-foreground">
                          Set up loading docks and receiving areas
                        </p>
                      </div>
                      <Button variant="outline">Manage Docks</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Organization</CardTitle>
                    <CardDescription>
                      Configure inventory organization and storage strategies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="storage-strategy">
                        Default Storage Strategy
                      </Label>
                      <Select defaultValue="fifo">
                        <SelectTrigger id="storage-strategy">
                          <SelectValue placeholder="Select strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fifo">
                            FIFO (First In, First Out)
                          </SelectItem>
                          <SelectItem value="lifo">
                            LIFO (Last In, First Out)
                          </SelectItem>
                          <SelectItem value="fefo">
                            FEFO (First Expired, First Out)
                          </SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-location">
                          Automatic Location Assignment
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically assign optimal storage locations for new
                          inventory
                        </p>
                      </div>
                      <Switch id="auto-location" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="cycle-counting">
                          Enable Cycle Counting
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Schedule regular inventory counts for accuracy
                        </p>
                      </div>
                      <Switch id="cycle-counting" defaultChecked />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Configure how and when you receive system notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="low-stock">Low Stock Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify when inventory items fall below minimum levels
                        </p>
                      </div>
                      <Switch id="low-stock" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="new-orders">
                          New Order Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Notify when new orders are received
                        </p>
                      </div>
                      <Switch id="new-orders" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="shipment-updates">
                          Shipment Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Notify when shipment status changes
                        </p>
                      </div>
                      <Switch id="shipment-updates" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="system-alerts">System Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify about system issues or maintenance
                        </p>
                      </div>
                      <Switch id="system-alerts" defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Methods</CardTitle>
                    <CardDescription>
                      Configure how notifications are delivered
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications to registered email addresses
                        </p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-notifications">
                          SMS Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Send text message alerts for critical notifications
                        </p>
                      </div>
                      <Switch id="sms-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">
                          Push Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications to mobile devices
                        </p>
                      </div>
                      <Switch id="push-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="slack-notifications">
                          Slack Integration
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Send notifications to Slack channels
                        </p>
                      </div>
                      <Switch id="slack-notifications" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="integrations" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>E-commerce Integrations</CardTitle>
                    <CardDescription>
                      Connect your warehouse to e-commerce platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">Shopify</h3>
                        <p className="text-sm text-muted-foreground">
                          Sync inventory and orders with Shopify stores
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">WooCommerce</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect to WordPress WooCommerce stores
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">Amazon</h3>
                        <p className="text-sm text-muted-foreground">
                          Integrate with Amazon Seller Central
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">eBay</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect to eBay marketplace
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Shipping & Logistics</CardTitle>
                    <CardDescription>
                      Connect with shipping carriers and logistics providers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">UPS</h3>
                        <p className="text-sm text-muted-foreground">
                          Generate UPS shipping labels and track shipments
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">FedEx</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect to FedEx shipping services
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">USPS</h3>
                        <p className="text-sm text-muted-foreground">
                          Integrate with USPS postal services
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">DHL</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect to DHL international shipping
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>ERP & Accounting</CardTitle>
                    <CardDescription>
                      Connect with ERP and accounting systems
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">QuickBooks</h3>
                        <p className="text-sm text-muted-foreground">
                          Sync financial data with QuickBooks
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">Xero</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect to Xero accounting platform
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">SAP</h3>
                        <p className="text-sm text-muted-foreground">
                          Integrate with SAP ERP systems
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">NetSuite</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect to Oracle NetSuite
                        </p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Configure security policies and access controls
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="ip-restriction">
                          IP Address Restrictions
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Limit system access to specific IP addresses or ranges
                        </p>
                      </div>
                      <Switch id="ip-restriction" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="audit-logging">
                          Advanced Audit Logging
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Enable detailed logging of all system activities
                        </p>
                      </div>
                      <Switch id="audit-logging" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="data-encryption">Data Encryption</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable end-to-end encryption for sensitive data
                        </p>
                      </div>
                      <Switch id="data-encryption" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-expiry">
                        Password Expiry (days)
                      </Label>
                      <Input
                        id="password-expiry"
                        type="number"
                        defaultValue="90"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Compliance</CardTitle>
                    <CardDescription>
                      Configure compliance settings and data retention policies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="gdpr">GDPR Compliance</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable features to comply with GDPR requirements
                        </p>
                      </div>
                      <Switch id="gdpr" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="hipaa">HIPAA Compliance</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable features to comply with HIPAA requirements
                        </p>
                      </div>
                      <Switch id="hipaa" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="data-retention">
                        Data Retention Period (months)
                      </Label>
                      <Input
                        id="data-retention"
                        type="number"
                        defaultValue="36"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-deletion">
                          Automatic Data Deletion
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically delete data after retention period
                          expires
                        </p>
                      </div>
                      <Switch id="auto-deletion" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Backup & Recovery</CardTitle>
                    <CardDescription>
                      Configure system backup and disaster recovery settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-backup">Automatic Backups</Label>
                        <p className="text-sm text-muted-foreground">
                          Schedule regular system backups
                        </p>
                      </div>
                      <Switch id="auto-backup" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">Backup Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger id="backup-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backup-retention">
                        Backup Retention (days)
                      </Label>
                      <Input
                        id="backup-retention"
                        type="number"
                        defaultValue="30"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="font-medium">Manual Backup</h3>
                        <p className="text-sm text-muted-foreground">
                          Create a backup of the current system state
                        </p>
                      </div>
                      <Button variant="outline">Create Backup</Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
