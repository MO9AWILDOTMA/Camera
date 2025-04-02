"use client";

import type React from "react";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CreditCard, Home, LogOut, Ticket, User } from "lucide-react";
import { useAuth } from "@/lib/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const PUBLIC_URL = process.env.NEXT_PUBLIC_PUBLIC_WEBSITE_URL;
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      router.push("/auth?redirect=/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="border-b">
          <div className="container flex h-16 items-center px-4 md:px-6">
            <div className="mr-4 hidden md:flex">
              <Link
                href="/"
                className="mr-6 flex items-center gap-2 text-lg font-bold"
              >
                Camera
              </Link>
              <nav className="flex items-center gap-6 text-sm">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </nav>
            </div>
            <div className="flex flex-1 items-center justify-end gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex flex-1">
          <div className="hidden w-64 flex-col border-r md:flex">
            <div className="p-6">
              <Skeleton className="h-6 w-full" />
            </div>
            <Separator />
            <nav className="flex-1 p-4">
              <div className="space-y-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </nav>
          </div>
          <div className="flex-1 p-8">
            <Skeleton className="h-8 w-64 mb-8" />
            <div className="grid gap-6">
              <Skeleton className="h-[500px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/reservations", label: "My Reservations", icon: Ticket },
    { href: "/dashboard/payments", label: "Payment History", icon: CreditCard },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <div className="mr-4 hidden md:flex">
            <Link
              href="/"
              className="mr-6 flex items-center gap-2 text-lg font-bold"
            >
              Camera
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link
                href="/"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Home
              </Link>
              <Link
                href={PUBLIC_URL + "/movies"}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Movies
              </Link>
              <Link
                href={PUBLIC_URL + "/screen_rooms"}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Screens
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>
                {user?.firstName.charAt(0)}
                {user?.lastName ? user?.lastName.charAt(0) : ""}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      <div className="flex flex-1">
        <div className="hidden w-64 flex-col border-r md:flex">
          <div className="p-6">
            <h2 className="text-lg font-semibold">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Separator />
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </nav>
          <div className="p-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
        <div className="flex-1 p-8">{children}</div>
      </div>
    </div>
  );
}
