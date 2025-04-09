"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Lock, ArrowLeft, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // In a real application, you would validate credentials against a backend
    // This is a simple mock authentication
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo credentials - in a real app, this would be a server-side check
      if (username === "admin" && password === "password") {
        // Set a session cookie or token in localStorage
        localStorage.setItem("adminAuth", "true");
        router.push("/admin");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/40 to-background p-4 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-grid-primary/[0.05] bg-[length:32px_32px]" />
      </div>

      {/* Back to dashboard button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-4 left-4 z-10"
      >
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="http://localhost:3000/"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md z-10"
      >
        <Card className="w-full shadow-lg border-muted/20">
          <CardHeader className="space-y-1 text-center pb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-4 ring-background">
                <Package className="h-8 w-8 text-primary" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold">
              WarehouseOS Admin
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5 pt-2">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert
                    variant="destructive"
                    className="border border-destructive/20"
                  >
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <div className="text-sm text-right"></div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button
                className="w-full h-11 text-base font-medium"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Sign In
                  </span>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Demo credentials: admin / password
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
