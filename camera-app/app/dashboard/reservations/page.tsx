"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { reservationsApi, showtimesApi, ticketApi } from "@/lib/api";
import Reservation from "@/models/reservation.model";
import { useAuth } from "@/lib/auth-provider";
import { useRouter } from "next/navigation";
import { GlobalStatus } from "@/models/enums/global.status.enum";
import Showtime from "@/models/showtime.model";
import Ticket from "@/models/ticket.model";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showtimeDetails, setShowtimeDetails] = useState<{
    [key: string]: Showtime;
  }>({});
  const [loading, setLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !isAuthenticated) {
      router.push("/auth?redirect=/dashboard");
    }

    const fetchReservationsAndShowtimes = async () => {
      try {
        setLoading(true);

        const reservationResp = await reservationsApi.getUserReservation(
          user!.id
        );

        const reservationData: Reservation[] = reservationResp.data || [];

        console.log(user);

        // Fetch showtime details for each reservation
        const showtimeSlugs = new Set(
          reservationData.map((res) => res.showtime.slug)
        );
        const showtimeDetailsObj: { [key: string]: Showtime } = {};

        for (const slug of showtimeSlugs) {
          try {
            const resp = await showtimesApi.getById(slug);
            showtimeDetailsObj[slug] = resp.data;
          } catch (error) {
            console.error(`Failed to get showtime with slug ${slug}:`, error);
          }
        }

        setReservations(reservationData);
        setShowtimeDetails(showtimeDetailsObj);
      } catch (error) {
        console.error("Failed to load reservation data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservationsAndShowtimes();
  }, [user, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCancelReservation = async (reservationId: number) => {
    try {
      await reservationsApi.cancel(reservationId);

      // Update local state
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === reservationId
            ? { ...reservation, status: GlobalStatus.CANCELLED as const }
            : reservation
        )
      );
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
    }
  };

  const handleTicketDownload = async (tickets: Ticket[]) => {
    setDownloadLoading(true);
    try {
      const ticketCodes = tickets.map((t) => t.uniqueCode);
      const response = await ticketApi.download(ticketCodes);

      // Handle binary response (PDF)
      if (response.data) {
        // Create blob from binary response
        const blob = new Blob([response.data], { type: "application/pdf" });

        // Create download link and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tickets-${ticketCodes.join("-")}.pdf`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Failed to download tickets:", error);
    } finally {
      setDownloadLoading(false);
    }
  };

  const formatSeatNumber = (seat: string) => {
    if (!seat || seat.length < 2) return seat;
    return `${seat.substring(0, 1)}-${seat.substring(1)}`;
  };

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
    );
  }

  const inprogressReservations = reservations.filter(
    (reservation) => reservation.status === GlobalStatus.IN_PROGRESS
  );
  const completedReservations = reservations.filter(
    (reservation) => reservation.status === GlobalStatus.CONFIRMED
  );
  const cancelledReservations = reservations.filter(
    (reservation) => reservation.status === GlobalStatus.CANCELLED
  );

  const now = new Date();

  const renderReservationCard = (
    reservation: Reservation,
    allowCancel = false
  ) => {
    const showtime = showtimeDetails[reservation.showtime.slug];

    return (
      <Card key={reservation.id} className="bg-slate-100">
        <div></div>
        <CardHeader>
          <div className="flex flex-col justify-between gap-4  md:flex-row md:items-center">
            <CardTitle>
              {showtime?.movie?.name || "Movie information unavailable"}
            </CardTitle>
            <div className="flex gap-2">
              {allowCancel && new Date(reservation.showtime.dateTime) > now && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancelReservation(reservation.id)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                {formatDate(reservation.showtime.dateTime)}
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                {showtime ? formatTime(showtime.dateTime) : "Time unavailable"}
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                {showtime?.screeningRoom?.name || "Screening room unavailable"}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium">Seats</h3>
              <div className="flex flex-wrap gap-2">
                {reservation.seats.map((seat, index) => (
                  <div
                    key={index}
                    className="rounded-md bg-muted px-2 py-1 text-xs"
                  >
                    {formatSeatNumber(seat)}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              {reservation.tickets && reservation.tickets.length > 0 && (
                <span className="text-gray-500 text-sm">
                  {reservation.tickets.length}{" "}
                  {reservation.tickets.length === 1 ? "ticket" : "tickets"}
                </span>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <span className="text-sm font-medium">Total:</span>{" "}
            <span className="text-sm">
              {reservation.showtime.price * reservation.tickets.length ||
                "0.00"}
              MAD
            </span>
          </div>
          <Button
            onClick={() => handleTicketDownload(reservation.tickets)}
            variant="outline"
            size="sm"
            disabled={
              downloadLoading ||
              !reservation.tickets ||
              reservation.tickets.length === 0
            }
          >
            <Download className="mr-2 h-4 w-4" />
            {reservation.status === GlobalStatus.CANCELLED
              ? ""
              : "Download Ticket"}
            {downloadLoading && "..."}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">My Reservations</h1>

      <Tabs defaultValue="in_progress">
        <TabsList className="mb-6">
          <TabsTrigger value="in_progress">
            In progress ({inprogressReservations.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedReservations.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledReservations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="in_progress">
          {inprogressReservations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="mb-4 text-center text-muted-foreground">
                  You don't have any in progress reservations
                </p>
                <Link href="/">
                  <Button>Browse Movies</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {inprogressReservations.map((reservation) =>
                renderReservationCard(reservation, true)
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedReservations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-center text-muted-foreground">
                  You don't have any completed reservations
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {completedReservations.map((reservation) =>
                renderReservationCard(reservation)
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {cancelledReservations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-center text-muted-foreground">
                  You don't have any cancelled reservations
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {cancelledReservations.map((reservation) =>
                renderReservationCard(reservation)
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
