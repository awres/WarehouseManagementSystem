"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

interface ValidationError {
  field: string;
  message: string;
}

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "WarehouseOS",
    contactEmail: "admin@warehouseos.com",
    supportPhone: "+1 (555) 123-4567",
    timezone: "UTC-5",
    dateFormat: "MM/DD/YYYY",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    lowStockAlerts: true,
    orderNotifications: true,
    systemUpdates: false,
    dailyReports: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: "90",
    sessionTimeout: "30",
    ipRestriction: "",
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation patterns
  const validationPatterns = {
    companyName: /^[a-zA-Z0-9\s\-&.]{2,50}$/,
    contactEmail: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    supportPhone: /^\+?[0-9\s\-()]{10,20}$/,
  };

  const validateGeneralSettings = () => {
    const newErrors: ValidationError[] = [];

    if (!validationPatterns.companyName.test(generalSettings.companyName)) {
      newErrors.push({
        field: "companyName",
        message:
          "Company name must be 2-50 characters and contain only letters, numbers, spaces, hyphens, & and .",
      });
    }

    if (!validationPatterns.contactEmail.test(generalSettings.contactEmail)) {
      newErrors.push({
        field: "contactEmail",
        message: "Please enter a valid email address",
      });
    }

    if (!validationPatterns.supportPhone.test(generalSettings.supportPhone)) {
      newErrors.push({
        field: "supportPhone",
        message:
          "Please enter a valid phone number (10-20 digits with optional +, spaces, hyphens, or parentheses)",
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSaveGeneral = async () => {
    // Clear previous messages
    setSuccessMessage(null);

    // Validate form
    if (!validateGeneralSettings()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would save to a backend
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // Save to localStorage for demo purposes
      localStorage.setItem("generalSettings", JSON.stringify(generalSettings));

      setSuccessMessage("General settings saved successfully");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      setErrors([
        {
          field: "general",
          message: "Failed to save settings. Please try again.",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveNotifications = () => {
    console.log("Notification preferences saved");
  };

  const handleSaveSecurity = () => {
    console.log("Security settings saved");
  };

  const getFieldError = (fieldName: string) => {
    return errors.find((error) => error.field === fieldName)?.message;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your system preferences and configurations
        </p>
      </div>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your basic system configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Company Information</h3>

                <div className="grid gap-2">
                  <Label htmlFor="companyName">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="companyName"
                    value={generalSettings.companyName}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        companyName: e.target.value,
                      })
                    }
                    className={
                      getFieldError("companyName") ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("companyName") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("companyName")}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="contactEmail">
                    Contact Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        contactEmail: e.target.value,
                      })
                    }
                    className={
                      getFieldError("contactEmail") ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("contactEmail") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("contactEmail")}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="supportPhone">
                    Support Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="supportPhone"
                    value={generalSettings.supportPhone}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        supportPhone: e.target.value,
                      })
                    }
                    className={
                      getFieldError("supportPhone") ? "border-red-500" : ""
                    }
                  />
                  {getFieldError("supportPhone") && (
                    <p className="text-sm text-red-500">
                      {getFieldError("supportPhone")}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Regional Settings</h3>

                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) =>
                      setGeneralSettings({
                        ...generalSettings,
                        timezone: value,
                      })
                    }
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-12">
                        UTC-12 (Baker Island)
                      </SelectItem>
                      <SelectItem value="UTC-11">
                        UTC-11 (American Samoa)
                      </SelectItem>
                      <SelectItem value="UTC-10">UTC-10 (Hawaii)</SelectItem>
                      <SelectItem value="UTC-9">UTC-9 (Alaska)</SelectItem>
                      <SelectItem value="UTC-8">
                        UTC-8 (Pacific Time)
                      </SelectItem>
                      <SelectItem value="UTC-7">
                        UTC-7 (Mountain Time)
                      </SelectItem>
                      <SelectItem value="UTC-6">
                        UTC-6 (Central Time)
                      </SelectItem>
                      <SelectItem value="UTC-5">
                        UTC-5 (Eastern Time)
                      </SelectItem>
                      <SelectItem value="UTC-4">
                        UTC-4 (Atlantic Time)
                      </SelectItem>
                      <SelectItem value="UTC-3">
                        UTC-3 (Buenos Aires)
                      </SelectItem>
                      <SelectItem value="UTC-2">
                        UTC-2 (Mid-Atlantic)
                      </SelectItem>
                      <SelectItem value="UTC-1">UTC-1 (Azores)</SelectItem>
                      <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                      <SelectItem value="UTC+1">UTC+1 (Paris)</SelectItem>
                      <SelectItem value="UTC+2">UTC+2 (Cairo)</SelectItem>
                      <SelectItem value="UTC+3">UTC+3 (Moscow)</SelectItem>
                      <SelectItem value="UTC+4">UTC+4 (Dubai)</SelectItem>
                      <SelectItem value="UTC+5">UTC+5 (Karachi)</SelectItem>
                      <SelectItem value="UTC+6">UTC+6 (Dhaka)</SelectItem>
                      <SelectItem value="UTC+7">UTC+7 (Bangkok)</SelectItem>
                      <SelectItem value="UTC+8">UTC+8 (Singapore)</SelectItem>
                      <SelectItem value="UTC+9">UTC+9 (Tokyo)</SelectItem>
                      <SelectItem value="UTC+10">UTC+10 (Sydney)</SelectItem>
                      <SelectItem value="UTC+11">
                        UTC+11 (Solomon Islands)
                      </SelectItem>
                      <SelectItem value="UTC+12">UTC+12 (Auckland)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={generalSettings.dateFormat}
                    onValueChange={(value) =>
                      setGeneralSettings({
                        ...generalSettings,
                        dateFormat: value,
                      })
                    }
                  >
                    <SelectTrigger id="dateFormat">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="YYYY/MM/DD">YYYY/MM/DD</SelectItem>
                      <SelectItem value="DD-MMM-YYYY">DD-MMM-YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="emailNotifications"
                  className="flex flex-col space-y-1"
                >
                  <span>Email Notifications</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive notifications via email
                  </span>
                </Label>
                <Switch
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="lowStockAlerts"
                  className="flex flex-col space-y-1"
                >
                  <span>Low Stock Alerts</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Get notified when inventory is running low
                  </span>
                </Label>
                <Switch
                  id="lowStockAlerts"
                  checked={notificationSettings.lowStockAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      lowStockAlerts: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="orderNotifications"
                  className="flex flex-col space-y-1"
                >
                  <span>Order Notifications</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive alerts for new orders and status changes
                  </span>
                </Label>
                <Switch
                  id="orderNotifications"
                  checked={notificationSettings.orderNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      orderNotifications: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="systemUpdates"
                  className="flex flex-col space-y-1"
                >
                  <span>System Updates</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Get notified about system updates and maintenance
                  </span>
                </Label>
                <Switch
                  id="systemUpdates"
                  checked={notificationSettings.systemUpdates}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      systemUpdates: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="dailyReports"
                  className="flex flex-col space-y-1"
                >
                  <span>Daily Reports</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive daily summary reports of activities
                  </span>
                </Label>
                <Switch
                  id="dailyReports"
                  checked={notificationSettings.dailyReports}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      dailyReports: checked,
                    })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure your account security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label
                  htmlFor="twoFactorAuth"
                  className="flex flex-col space-y-1"
                >
                  <span>Two-Factor Authentication</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </span>
                </Label>
                <Switch
                  id="twoFactorAuth"
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    setSecuritySettings({
                      ...securitySettings,
                      twoFactorAuth: checked,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  min="0"
                  max="365"
                  value={securitySettings.passwordExpiry}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      passwordExpiry: e.target.value,
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Set to 0 for no expiration
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sessionTimeout">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="5"
                  max="1440"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      sessionTimeout: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ipRestriction">IP Restrictions</Label>
                <Textarea
                  id="ipRestriction"
                  placeholder="Enter allowed IP addresses (one per line)"
                  value={securitySettings.ipRestriction}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      ipRestriction: e.target.value,
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Leave blank to allow access from any IP address
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSecurity}>
                <Save className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
