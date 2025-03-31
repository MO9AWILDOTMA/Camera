import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-provider";
import { ResponsiveHeader } from "@/components/home/responsive-header";
import Link from "next/link";
import "../../app/globals.css";

export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <ResponsiveHeader />
      <main className="container px-6 lg:px-20 py-6 md:px-6 md:py-8">
        {children}
      </main>
      <footer className="border-t py-6 px-10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} Camera. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:underline"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
