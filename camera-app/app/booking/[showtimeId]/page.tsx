"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, CreditCard } from "lucide-react";
import { useAuth } from "@/lib/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Loading from "@/app/loading";
import { showtimesApi } from "@/lib/api";
import GlobalLayout from "@/components/home/layout";
import Showtime from "@/models/showtime.model";
import { Seat } from "@/models/screening-room.model";

export default function BookingPage({
  params,
}: {
  params: { showtimeId: string };
}) {
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [seats, setSeats] = useState<Seat[][]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchShowtimeAndSeats = async () => {
      try {
        const resp = await showtimesApi.getById(params.showtimeId);
        const data = resp.data;
        setShowtime(data);

        // Organize seats by row from the screening room
        if (data.screeningRoom?.seats) {
          const seatsByRow: Record<string, Seat[]> = {};

          data.screeningRoom.seats.forEach((seat: Seat) => {
            if (!seatsByRow[seat.row]) {
              seatsByRow[seat.row] = [];
            }
            seatsByRow[seat.row].push({
              id: `${seat.row}-${seat.number}`,
              row: seat.row,
              number: seat.number,
              status: seat.status === "RESERVED" ? "UNAVAILABLE" : "AVAILABLE",
            });
          });

          // Convert to 2D array sorted by row and seat number
          const sortedRows = Object.keys(seatsByRow).sort();
          const organizedSeats = sortedRows.map((row) => {
            return seatsByRow[row].sort((a, b) => a.number - b.number);
          });

          setSeats(organizedSeats);
        }
      } catch (error) {
        console.error("Failed to fetch showtime and seats:", error);
        toast({
          title: "Error",
          description: "Failed to load booking information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimeAndSeats();
  }, [params.showtimeId, toast]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "UNAVAILABLE") return;

    setSeats((prevSeats) => {
      return prevSeats.map((row) =>
        row.map((s) =>
          s.id === seat.id
            ? {
                ...s,
                status: s.status === "SELECTED" ? "AVAILABLE" : "SELECTED",
              }
            : s
        )
      );
    });

    setSelectedSeats((prevSelected) => {
      const isAlreadySelected = prevSelected.some((s) => s.id === seat.id);
      return isAlreadySelected
        ? prevSelected.filter((s) => s.id !== seat.id)
        : [...prevSelected, { ...seat, status: "SELECTED" }];
    });
  };

  const handleProceedToPayment = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with your booking",
      });
      router.push(`/auth?redirect=/booking/${params.showtimeId}`);
      return;
    }

    if (selectedSeats.length === 0) {
      toast({
        title: "No Seats Selected",
        description: "Please select at least one seat to continue",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Booking Successful",
      description: "Your tickets have been booked successfully",
    });
    router.push("/dashboard/reservations");
  };

  const getTotalPrice = () => {
    if (!showtime) return 0;
    return selectedSeats.length * showtime.price;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (!showtime) {
    return (
      <div className="container mx-auto px-4 h-screen flex items-center flex-col pt-44">
        <h1 className="text-2xl font-bold">Showtime not found</h1>
        <Link href="/">
          <Button className="mt-4">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <GlobalLayout>
      <div className="container mx-auto px-4 pb-8">
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href={`/showtimes/${showtime.movie.slug}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Showtimes
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{showtime.movie.name}</h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDate(showtime.dateTime)}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {formatTime(showtime.dateTime)}
                </div>
                <div>{showtime.screeningRoom.name}</div>
              </div>
            </div>

            <div className="mb-8 w-full overflow-x-auto">
              <div className="mb-4 w-full rounded-lg bg-muted p-2 text-center text-sm font-medium">
                Screen
              </div>

              <div className="mb-8 flex justify-center">
                <div className="space-y-2">
                  {seats.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center gap-2">
                      <div className="w-6 text-center text-sm font-medium">
                        {row[0]?.row}
                      </div>
                      <div className="flex gap-1">
                        {row.map((seat) => (
                          <button
                            key={seat.id}
                            className={`h-8 w-8 rounded-t-lg text-xs font-medium transition-colors ${
                              seat.status === "UNAVAILABLE"
                                ? "cursor-not-allowed bg-muted text-muted-foreground"
                                : seat.status === "SELECTED"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-background hover:bg-muted"
                            }`}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.status === "UNAVAILABLE"}
                          >
                            {seat.number}
                          </button>
                        ))}
                      </div>
                      <div className="w-6 text-center text-sm font-medium">
                        {row[0]?.row}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-sm bg-background border"></div>
                  <span className="text-xs">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-sm bg-muted"></div>
                  <span className="text-xs">Unavailable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-sm bg-primary"></div>
                  <span className="text-xs">Selected</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
                <CardDescription>{showtime.screeningRoom.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">{showtime.movie.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(showtime.dateTime)} •{" "}
                    {formatTime(showtime.dateTime)}
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Selected Seats</h3>
                  {selectedSeats.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No seats selected
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedSeats.map((seat) => (
                        <div
                          key={seat.id}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {seat.row}-{seat.number}
                          </span>
                          <span>€{showtime.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedSeats.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>€{getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleProceedToPayment}
                  disabled={selectedSeats.length === 0}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceed to Payment
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </GlobalLayout>
  );
}
