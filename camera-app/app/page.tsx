"use client";

import Link from "next/link";
import { FeaturedMovies } from "@/components/home/featured-movies";
import { CurrentlyShowing } from "@/components/home/currently-showing";
import { UpcomingMovies } from "@/components/home/upcoming-movies";
import { useAuth } from "@/lib/auth-provider";
import Loading from "./loading";
import { ResponsiveHeader } from "@/components/home/responsive-header";
import GlobalLayout from "@/components/home/layout";

export default function HomePage() {
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <GlobalLayout>
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
    </GlobalLayout>
  );
}
