"use client";

import Link from "next/link";
import { FeaturedMovies } from "@/components/home/featured-movies";
import { CurrentlyShowing } from "@/components/home/currently-showing";
import { UpcomingMovies } from "@/components/home/upcoming-movies";
import { useAuth } from "@/lib/auth-provider";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Loading from "./loading";
import { ResponsiveHeader } from "@/components/home/responsive-header";

export default function HomePage() {
  const { isAuthenticated, logout, loading, isAdmin } = useAuth();
  const router = useRouter();

  async function onLogout() {
    try {
      await logout();
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background">
      <ResponsiveHeader
        isAdmin={isAdmin}
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
      />
      <main className="container px-6 lg:px-20 py-6 md:px-6 md:py-8">
        <section className="mb-12">
          <FeaturedMovies />
        </section>
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Now Showing</h2>
          <CurrentlyShowing />
        </section>
        <section>
          <h2 className="mb-6 text-2xl font-bold">Coming Soon</h2>
          <UpcomingMovies />
        </section>
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
