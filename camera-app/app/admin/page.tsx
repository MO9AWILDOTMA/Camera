"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Film, Ticket, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chart } from "@/components/ui/chart";
import Loading from "../loading";
import Activity from "@/components/admin/activity";
import { analyticsApi } from "@/lib/api";

type AnalyticsData = {
  sales: {
    total: number;
    change: number;
    data: { date: string; value: number }[];
  };
  revenue: {
    total: number;
    change: number;
    data: { date: string; value: number }[];
  };
  occupancy: {
    average: number;
    change: number;
    data: { date: string; value: number }[];
  };
  topMovies: {
    title: string;
    tickets: number;
    revenue: number;
  }[];
};

export default function AdminDashboardPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");
  const [days, setDays] = useState<number>(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // For demo purposes, we'll use placeholder data
        // In a real app, you would use:
        const analyticsResponse = await analyticsApi.getAnalyticsData(days);

        // Generate dates for the last 7 days
        // const dates = Array.from({ length: 7 }, (_, i) => {
        //   const date = new Date();
        //   date.setDate(date.getDate() - (6 - i));
        //   return date.toISOString().split("T")[0];
        // });

        // Generate random data for sales
        // const salesData = dates.map((date) => ({
        //   date,
        //   value: Math.floor(Math.random() * 100) + 50,
        // }));

        // Generate random data for revenue
        // const revenueData = dates.map((date) => ({
        //   date,
        //   value: Math.floor(Math.random() * 2000) + 500,
        // }));

        // Generate random data for occupancy
        // const occupancyData = dates.map((date) => ({
        //   date,
        //   value: Math.floor(Math.random() * 30) + 40,
        // }));

        // const mockAnalytics: AnalyticsData = {
        //   sales: {
        //     total: salesData.reduce((sum, item) => sum + item.value, 0),
        //     change: 12.5,
        //     data: salesData,
        //   },
        //   revenue: {
        //     total: revenueData.reduce((sum, item) => sum + item.value, 0),
        //     change: 8.2,
        //     data: revenueData,
        //   },
        //   occupancy: {
        //     average:
        //       occupancyData.reduce((sum, item) => sum + item.value, 0) /
        //       occupancyData.length,
        //     change: 5.7,
        //     data: occupancyData,
        //   },
        //   topMovies: [
        //     { title: "Interstellar", tickets: 245, revenue: 3675 },
        //     { title: "The Dark Knight", tickets: 198, revenue: 2970 },
        //     { title: "Inception", tickets: 156, revenue: 2340 },
        //     { title: "The Shawshank Redemption", tickets: 132, revenue: 1980 },
        //   ],
        // };

        setAnalyticsData(analyticsResponse.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [days, period]);

  useEffect(() => {
    if (period === "month") setDays(30);
    else if (period === "day") setDays(1);
    else setDays(7);
  }, [period]);

  if (loading) {
    return <Loading />;
  }

  if (!analyticsData) {
    return (
      <div className="p-4">
        <h1 className="mb-8 text-2xl md:text-3xl font-bold">Dashboard</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-center text-muted-foreground">
              Failed to load analytics data
            </p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header with Responsive Layout */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <Tabs
          value={period}
          onValueChange={(value) => setPeriod(value as any)}
          className="w-full md:w-auto"
        >
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="day" className="flex-1 md:flex-none">
              Day
            </TabsTrigger>
            <TabsTrigger value="week" className="flex-1 md:flex-none">
              Week
            </TabsTrigger>
            <TabsTrigger value="month" className="flex-1 md:flex-none">
              Month
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics - Responsive Grid */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <CardDescription>Tickets sold</CardDescription>
            </div>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.sales.total}
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">
                +{analyticsData.sales.change}%
              </span>
              <span className="ml-1 text-muted-foreground">
                from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <CardDescription>In MAD</CardDescription>
            </div>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analyticsData.revenue.total.toLocaleString()}
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">
                +{analyticsData.revenue.change}%
              </span>
              <span className="ml-1 text-muted-foreground">
                from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">
                Average Occupancy
              </CardTitle>
              <CardDescription>Percentage</CardDescription>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.occupancy.average.toFixed(1)}%
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">
                +{analyticsData.occupancy.change}%
              </span>
              <span className="ml-1 text-muted-foreground">
                from last period
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Top Performing Sections - Responsive Grid */}
      <div className="mt-6 md:mt-8 grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        {/* Revenue Over Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              type="line"
              data={{
                labels: analyticsData.revenue.data.map((item) => {
                  const date = new Date(item.date);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }),
                datasets: [
                  {
                    label: "Revenue",
                    data: analyticsData.revenue.data.map((item) => item.value),
                    borderColor: "hsl(var(--primary))",
                    backgroundColor: "hsl(var(--primary) / 0.1)",
                    tension: 0.3,
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => `$${context.raw}`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `$${value}`,
                    },
                  },
                },
              }}
              className="h-[250px] md:h-[300px]"
            />
          </CardContent>
        </Card>

        {/* Top Performing Movies */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Performing Movies</CardTitle>
            <Link href="/admin/movies">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topMovies.map((movie, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <Film className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{movie.title}</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {movie.tickets} tickets
                    </div>
                    <div className="font-medium text-xs sm:text-sm">
                      ${movie.revenue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Occupancy - Responsive Grid */}
      <div className="mt-6 md:mt-8 grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <Activity />

        {/* Occupancy Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              type="bar"
              data={{
                labels: analyticsData.occupancy.data.map((item) => {
                  const date = new Date(item.date);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }),
                datasets: [
                  {
                    label: "Occupancy",
                    data: analyticsData.occupancy.data.map(
                      (item) => item.value
                    ),
                    backgroundColor: "hsl(var(--primary))",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.raw}%`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: (value) => `${value}%`,
                    },
                  },
                },
              }}
              className="h-[250px] md:h-[300px]"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
