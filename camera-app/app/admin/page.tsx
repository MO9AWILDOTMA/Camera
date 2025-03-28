"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, Film, Ticket, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chart } from "@/components/ui/chart"

type AnalyticsData = {
  sales: {
    total: number
    change: number
    data: { date: string; value: number }[]
  }
  revenue: {
    total: number
    change: number
    data: { date: string; value: number }[]
  }
  occupancy: {
    average: number
    change: number
    data: { date: string; value: number }[]
  }
  topMovies: {
    title: string
    tickets: number
    revenue: number
  }[]
}

export default function AdminDashboardPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [period, setPeriod] = useState<"day" | "week" | "month">("week")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // For demo purposes, we'll use placeholder data
        // In a real app, you would use:
        // const salesResponse = await analyticsApi.getSales(period)
        // const revenueResponse = await analyticsApi.getRevenue(period)
        // const occupancyResponse = await analyticsApi.getOccupancy(period)

        // Generate dates for the last 7 days
        const dates = Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))
          return date.toISOString().split("T")[0]
        })

        // Generate random data for sales
        const salesData = dates.map((date) => ({
          date,
          value: Math.floor(Math.random() * 100) + 50,
        }))

        // Generate random data for revenue
        const revenueData = dates.map((date) => ({
          date,
          value: Math.floor(Math.random() * 2000) + 500,
        }))

        // Generate random data for occupancy
        const occupancyData = dates.map((date) => ({
          date,
          value: Math.floor(Math.random() * 30) + 40,
        }))

        const mockAnalytics: AnalyticsData = {
          sales: {
            total: salesData.reduce((sum, item) => sum + item.value, 0),
            change: 12.5,
            data: salesData,
          },
          revenue: {
            total: revenueData.reduce((sum, item) => sum + item.value, 0),
            change: 8.2,
            data: revenueData,
          },
          occupancy: {
            average: occupancyData.reduce((sum, item) => sum + item.value, 0) / occupancyData.length,
            change: 5.7,
            data: occupancyData,
          },
          topMovies: [
            { title: "Interstellar", tickets: 245, revenue: 3675 },
            { title: "The Dark Knight", tickets: 198, revenue: 2970 },
            { title: "Inception", tickets: 156, revenue: 2340 },
            { title: "The Shawshank Redemption", tickets: 132, revenue: 1980 },
          ],
        }

        setAnalyticsData(mockAnalytics)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [period])

  if (loading) {
    return (
      <div>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div>
        <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-center text-muted-foreground">Failed to load analytics data</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Tabs value={period} onValueChange={(value) => setPeriod(value as any)}>
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <CardDescription>Tickets sold</CardDescription>
            </div>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.sales.total}</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">+{analyticsData.sales.change}%</span>
              <span className="ml-1 text-muted-foreground">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <CardDescription>In USD</CardDescription>
            </div>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.revenue.total.toLocaleString()}</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">+{analyticsData.revenue.change}%</span>
              <span className="ml-1 text-muted-foreground">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Average Occupancy</CardTitle>
              <CardDescription>Percentage</CardDescription>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.occupancy.average.toFixed(1)}%</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">+{analyticsData.occupancy.change}%</span>
              <span className="ml-1 text-muted-foreground">from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              type="line"
              data={{
                labels: analyticsData.revenue.data.map((item) => {
                  const date = new Date(item.date)
                  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
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
                plugins: {
                  legend: {
                    display: false,
                  },
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
              className="h-[300px]"
            />
          </CardContent>
        </Card>

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
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Film className="h-4 w-4 text-muted-foreground" />
                    <span>{movie.title}</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-sm text-muted-foreground">{movie.tickets} tickets</div>
                    <div className="font-medium">${movie.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Ticket className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">New Booking</p>
                  <p className="text-xs text-muted-foreground">2 tickets for Interstellar</p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">10 minutes ago</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Film className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">New Movie Added</p>
                  <p className="text-xs text-muted-foreground">Dune: Part Two</p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">2 hours ago</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">New User Registered</p>
                  <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">5 hours ago</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              type="bar"
              data={{
                labels: analyticsData.occupancy.data.map((item) => {
                  const date = new Date(item.date)
                  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }),
                datasets: [
                  {
                    label: "Occupancy",
                    data: analyticsData.occupancy.data.map((item) => item.value),
                    backgroundColor: "hsl(var(--primary))",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
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
              className="h-[300px]"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />
}

