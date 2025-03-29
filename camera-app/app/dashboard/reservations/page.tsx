"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, Clock, Download, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Booking = {
  id: string
  movieId: string
  movieTitle: string
  theaterId: string
  theaterName: string
  screenName: string
  date: string
  startTime: string
  endTime: string
  seats: {
    id: string
    row: string
    number: number
    type: string
  }[]
  totalPrice: number
  status: "upcoming" | "completed" | "cancelled"
  qrCode?: string
}

export default function ReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // For demo purposes, we'll use placeholder data
        // In a real app, you would use: const response = await bookingsApi.getUserBookings()

        const mockBookings: Booking[] = [
          {
            id: "1",
            movieId: "1",
            movieTitle: "Interstellar",
            theaterId: "1",
            theaterName: "CineTix Downtown",
            screenName: "Screen 1",
            date: "2023-09-15",
            startTime: "19:00",
            endTime: "21:45",
            seats: [
              { id: "D-5", row: "D", number: 5, type: "premium" },
              { id: "D-6", row: "D", number: 6, type: "premium" },
            ],
            totalPrice: 25.98,
            status: "upcoming",
            qrCode: "/placeholder.svg?height=200&width=200",
          },
          {
            id: "2",
            movieId: "2",
            movieTitle: "The Dark Knight",
            theaterId: "2",
            theaterName: "CineTix Westside",
            screenName: "Screen 3",
            date: "2023-09-17",
            startTime: "14:30",
            endTime: "17:15",
            seats: [
              { id: "G-10", row: "G", number: 10, type: "vip" },
              { id: "G-11", row: "G", number: 11, type: "vip" },
              { id: "G-12", row: "G", number: 12, type: "vip" },
            ],
            totalPrice: 44.97,
            status: "upcoming",
            qrCode: "/placeholder.svg?height=200&width=200",
          },
          {
            id: "3",
            movieId: "3",
            movieTitle: "Inception",
            theaterId: "1",
            theaterName: "CineTix Downtown",
            screenName: "Screen 2",
            date: "2023-09-10",
            startTime: "20:00",
            endTime: "22:30",
            seats: [
              { id: "B-8", row: "B", number: 8, type: "standard" },
              { id: "B-9", row: "B", number: 9, type: "standard" },
            ],
            totalPrice: 29.98,
            status: "completed",
          },
          {
            id: "4",
            movieId: "4",
            movieTitle: "The Shawshank Redemption",
            theaterId: "2",
            theaterName: "CineTix Westside",
            screenName: "Screen 1",
            date: "2023-09-05",
            startTime: "18:00",
            endTime: "20:30",
            seats: [{ id: "C-5", row: "C", number: 5, type: "standard" }],
            totalPrice: 14.99,
            status: "cancelled",
          },
        ]

        setBookings(mockBookings)
      } catch (error) {
        console.error("Failed to fetch bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      // In a real app, you would use: await bookingsApi.cancel(bookingId)

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: "cancelled" as const } : booking,
        ),
      )
    } catch (error) {
      console.error("Failed to cancel booking:", error)
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="mb-8 text-3xl font-bold">My Reservations</h1>
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="animate-pulse bg-muted h-16"></CardHeader>
              <CardContent className="animate-pulse bg-muted h-32 mt-2"></CardContent>
              <CardFooter className="animate-pulse bg-muted h-12 mt-2"></CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const upcomingBookings = bookings.filter((booking) => booking.status === "upcoming")
  const completedBookings = bookings.filter((booking) => booking.status === "completed")
  const cancelledBookings = bookings.filter((booking) => booking.status === "cancelled")

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">My Reservations</h1>

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="mb-4 text-center text-muted-foreground">You don't have any upcoming reservations</p>
                <Link href="/">
                  <Button>Browse Movies</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <CardTitle>{booking.movieTitle}</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/reservations/${booking.id}`}>View Details</Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDate(booking.date)}
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          {booking.startTime} - {booking.endTime}
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          {booking.theaterName} • {booking.screenName}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-2 text-sm font-medium">Seats</h3>
                        <div className="flex flex-wrap gap-2">
                          {booking.seats.map((seat) => (
                            <div key={seat.id} className="rounded-md bg-muted px-2 py-1 text-xs">
                              {seat.row}-{seat.number}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        {booking.qrCode && (
                          <img src={booking.qrCode || "/placeholder.svg"} alt="Ticket QR Code" className="h-24 w-24" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div>
                      <span className="text-sm font-medium">Total:</span>{" "}
                      <span className="text-sm">${booking.totalPrice.toFixed(2)}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download Ticket
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-center text-muted-foreground">You don't have any completed reservations</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {completedBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <CardTitle>{booking.movieTitle}</CardTitle>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/reservations/${booking.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDate(booking.date)}
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          {booking.startTime} - {booking.endTime}
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                          {booking.theaterName} • {booking.screenName}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-2 text-sm font-medium">Seats</h3>
                        <div className="flex flex-wrap gap-2">
                          {booking.seats.map((seat) => (
                            <div key={seat.id} className="rounded-md bg-muted px-2 py-1 text-xs">
                              {seat.row}-{seat.number}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div>
                      <span className="text-sm font-medium">Total:</span>{" "}
                      <span className="text-sm">${booking.totalPrice.toFixed(2)}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download Receipt
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {cancelledBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-center text-muted-foreground">You don't have any cancelled reservations</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {cancelledBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <CardTitle>{booking.movieTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatDate(booking.date)}
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {booking.startTime} - {booking.endTime}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        {booking.theaterName} • {booking.screenName}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div>
                      <span className="text-sm font-medium">Total:</span>{" "}
                      <span className="text-sm">${booking.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="rounded-md bg-muted px-3 py-1 text-sm">Cancelled</div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

