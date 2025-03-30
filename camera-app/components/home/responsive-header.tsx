import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { TheaterSelector } from "@/components/home/theater-selector";

interface HeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

export function ResponsiveHeader({
  isAuthenticated,
  isAdmin,
  onLogout,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b px-4 md:px-8">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          Camera
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {/* <TheaterSelector /> */}
          {!isAuthenticated ? (
            <Link href="/auth">
              <Button variant="outline">Sign In</Button>
            </Link>
          ) : (
            <>
              {!isAdmin ? (
                <Link href="/admin">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              )}
              <Button
                variant="outline"
                className="text-white hover:text-white hover:bg-red-700 bg-red-600"
                onClick={() => onLogout()}
              >
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-4 pt-8">
                {/* <TheaterSelector /> */}
                {!isAuthenticated ? (
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                ) : (
                  <>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      className="w-full text-white hover:text-white hover:bg-red-700 bg-red-600"
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
