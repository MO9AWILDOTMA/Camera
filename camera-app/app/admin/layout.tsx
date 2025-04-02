"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "@/lib/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems } from "./nav-items";
import Loading from "../loading";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push("/auth?redirect=/admin");
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  async function handleLogout() {
    try {
      await logout();
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully",
      });
      router.push("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Unable to logout. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <div className="border-b md:hidden">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-lg font-bold"
          >
            CAMERA <span className="text-[10px]  self-end pt-3">Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {user?.firstName.charAt(0)}
                          {user?.lastName ? user?.lastName.charAt(0) : ""}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-lg font-semibold">
                          {user?.firstName} {user?.lastName}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Administrator
                        </p>
                      </div>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <Separator className="my-4" />
                <nav className="space-y-2 flex gap-48 flex-col">
                  <div>
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant={
                            pathname === item.href ? "secondary" : "ghost"
                          }
                          className="w-full justify-start"
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>
                {user?.firstName.charAt(0)}
                {user?.lastName ? user?.lastName.charAt(0) : ""}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden border-b md:block">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <div className="mr-4 flex">
            <Link
              href="/admin"
              className="mr-6 flex items-center gap-2 text-lg font-bold"
            >
              CAMERA <span className="text-[9px] self-end pt-3">Admin</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link
                href="/"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                View Site
              </Link>
              <Link
                href="/admin/analytics"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Analytics
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
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

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden w-64 flex-col border-r md:flex relative">
          <div className="p-6">
            <h2 className="text-lg font-semibold">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">Administrator</p>
          </div>
          <Separator />
          <nav className="flex flex-col flex-1 p-4 overflow-y-auto">
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

          {/* Fixed Logout Button */}
          <div className="p-4 border-t">
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

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
