import Link from "next/link";
import { Package, Save } from "lucide-react";
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
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure your warehouse management system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Package className="h-4 w-4" />
            WarehouseOS
          </Link>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Company Information</CardTitle>
                <CardDescription>Update your company details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="Acme Logistics" />
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
                        <SelectItem value="utc-8">UTC-08:00 (PST)</SelectItem>
                        <SelectItem value="utc-7">UTC-07:00 (MST)</SelectItem>
                        <SelectItem value="utc-6">UTC-06:00 (CST)</SelectItem>
                        <SelectItem value="utc-5">UTC-05:00 (EST)</SelectItem>
                        <SelectItem value="utc+1">UTC+01:00 (CET)</SelectItem>
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
                <Button size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">System Preferences</CardTitle>
                <CardDescription>
                  Configure system-wide settings
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
                        <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                        <SelectItem value="imperial">
                          Imperial (lb, in)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-reorder">Automatic Reordering</Label>
                  <Switch id="auto-reorder" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="barcode-scanning">
                    Enable Barcode Scanning
                  </Label>
                  <Switch id="barcode-scanning" defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">User Roles</p>
                    <p className="text-xs text-muted-foreground">
                      Configure access levels
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">User Accounts</p>
                    <p className="text-xs text-muted-foreground">
                      Add or edit users
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Activity Logs</p>
                    <p className="text-xs text-muted-foreground">
                      View user activity
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Authentication Settings
                </CardTitle>
                <CardDescription>Configure security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <Switch id="two-factor" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password-policy">
                    Strong Password Policy
                  </Label>
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
                    className="max-w-[120px]"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="warehouses">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Warehouse Locations</CardTitle>
                <CardDescription>Manage warehouse locations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Warehouse Facilities</p>
                    <p className="text-xs text-muted-foreground">
                      Manage facilities
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Storage Zones</p>
                    <p className="text-xs text-muted-foreground">
                      Configure zones
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dock Management</p>
                    <p className="text-xs text-muted-foreground">
                      Set up loading docks
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Inventory Organization
                </CardTitle>
                <CardDescription>Configure storage strategies</CardDescription>
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-location">
                    Automatic Location Assignment
                  </Label>
                  <Switch id="auto-location" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="cycle-counting">Enable Cycle Counting</Label>
                  <Switch id="cycle-counting" defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Configure system notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="low-stock">Low Stock Alerts</Label>
                  <Switch id="low-stock" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-orders">New Order Notifications</Label>
                  <Switch id="new-orders" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="shipment-updates">Shipment Updates</Label>
                  <Switch id="shipment-updates" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="system-alerts">System Alerts</Label>
                  <Switch id="system-alerts" defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Delivery Methods</CardTitle>
                <CardDescription>
                  Configure notification delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <Switch id="sms-notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="slack-notifications">Slack Integration</Label>
                  <Switch id="slack-notifications" />
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  E-commerce Integrations
                </CardTitle>
                <CardDescription>
                  Connect to e-commerce platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-3">
                    <p className="font-medium">Shopify</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Sync inventory and orders
                    </p>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="font-medium">WooCommerce</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Connect to WordPress
                    </p>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="font-medium">Amazon</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Integrate with Seller Central
                    </p>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="font-medium">eBay</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Connect to marketplace
                    </p>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Shipping & Logistics</CardTitle>
                <CardDescription>
                  Connect with shipping carriers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-3">
                    <p className="font-medium">UPS</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Generate shipping labels
                    </p>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="font-medium">FedEx</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Connect to shipping services
                    </p>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="font-medium">USPS</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Integrate postal services
                    </p>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="border rounded-md p-3">
                    <p className="font-medium">DHL</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      International shipping
                    </p>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Security Settings</CardTitle>
                <CardDescription>Configure security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ip-restriction">
                    IP Address Restrictions
                  </Label>
                  <Switch id="ip-restriction" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="audit-logging">Advanced Audit Logging</Label>
                  <Switch id="audit-logging" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="data-encryption">Data Encryption</Label>
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
                    className="max-w-[120px]"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Backup & Recovery</CardTitle>
                <CardDescription>
                  Configure system backup settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-backup">Automatic Backups</Label>
                  <Switch id="auto-backup" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger
                      id="backup-frequency"
                      className="max-w-[200px]"
                    >
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
                    className="max-w-[120px]"
                  />
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm">
                    Create Manual Backup
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
