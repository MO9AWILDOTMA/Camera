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

type Showtime = {
  id: string;
  movieId: string;
  movieTitle: string;
  theaterId: string;
  theaterName: string;
  screenName: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
};

type Seat = {
  id: string;
  row: string;
  number: number;
  type: "standard" | "premium" | "vip";
  status: "available" | "reserved" | "selected" | "unavailable";
  price: number;
};

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
        // For demo purposes, we'll use placeholder data
        // In a real app, you would use:
        // const showtimeResponse = await showtimesApi.getById(params.showtimeId)
        // const seatsResponse = await seatsApi.getByShowtime(params.showtimeId)

        // Parse showtime ID to get date and time
        const [date, time, theaterId] = params.showtimeId.split("-");

        const mockShowtime: Showtime = {
          id: params.showtimeId,
          movieId: "1",
          movieTitle: "Interstellar",
          theaterId,
          theaterName:
            theaterId === "1" ? "CineTix Downtown" : "CineTix Westside",
          screenName: theaterId === "1" ? "Screen 1" : "Screen 3",
          date,
          startTime: time,
          endTime:
            time === "10:00"
              ? "12:45"
              : time === "14:30"
                ? "17:15"
                : time === "19:00"
                  ? "21:45"
                  : time === "11:30"
                    ? "14:15"
                    : "20:45",
          price: theaterId === "1" ? 12.99 : 14.99,
        };

        // Generate mock seats
        const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
        const mockSeats: Seat[][] = [];

        rows.forEach((row, rowIndex) => {
          const seatsInRow: Seat[] = [];
          const seatsCount = row === "A" || row === "H" ? 8 : 10;

          for (let i = 1; i <= seatsCount; i++) {
            // Determine seat type
            let type: "standard" | "premium" | "vip" = "standard";
            if (row === "D" || row === "E") {
              type = "premium";
            } else if (row === "G") {
              type = "vip";
            }

            // Determine seat status (randomly make some seats unavailable)
            let status: "available" | "reserved" | "unavailable" = "available";
            if (Math.random() < 0.2) {
              status = "unavailable";
            }

            // Calculate price based on seat type
            let price = mockShowtime.price;
            if (type === "premium") price *= 1.2;
            if (type === "vip") price *= 1.5;

            seatsInRow.push({
              id: `${row}-${i}`,
              row,
              number: i,
              type,
              status,
              price,
            });
          }

          mockSeats.push(seatsInRow);
        });

        setShowtime(mockShowtime);
        setSeats(mockSeats);
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
    if (seat.status === "unavailable") return;

    setSeats((prevSeats) => {
      const newSeats = [...prevSeats];

      // Find the seat in the array and update its status
      for (let i = 0; i < newSeats.length; i++) {
        for (let j = 0; j < newSeats[i].length; j++) {
          if (newSeats[i][j].id === seat.id) {
            const isSelected = newSeats[i][j].status === "selected";
            newSeats[i][j] = {
              ...newSeats[i][j],
              status: isSelected ? "available" : "selected",
            };
            break;
          }
        }
      }

      return newSeats;
    });

    setSelectedSeats((prevSelected) => {
      const isAlreadySelected = prevSelected.some((s) => s.id === seat.id);

      if (isAlreadySelected) {
        return prevSelected.filter((s) => s.id !== seat.id);
      } else {
        return [...prevSelected, seat];
      }
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

    // In a real app, you would create a booking and redirect to payment
    // For demo purposes, we'll just show a success message
    toast({
      title: "Booking Successful",
      description: "Your tickets have been booked successfully",
    });
    router.push("/dashboard/reservations");
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (!showtime) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Showtime not found</h1>
        <Link href="/">
          <Button className="mt-4">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href={`/showtimes/${showtime.movieId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Showtimes
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{showtime.movieTitle}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {formatDate(showtime.date)}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {showtime.startTime} - {showtime.endTime}
              </div>
              <div>
                {showtime.theaterName} • {showtime.screenName}
              </div>
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
                            seat.status === "unavailable"
                              ? "cursor-not-allowed bg-muted text-muted-foreground"
                              : seat.status === "selected"
                                ? "bg-primary text-primary-foreground"
                                : seat.type === "premium"
                                  ? "bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50"
                                  : seat.type === "vip"
                                    ? "bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50"
                                    : "bg-background hover:bg-muted"
                          }`}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status === "unavailable"}
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
                <span className="text-xs">Standard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-amber-100 dark:bg-amber-900/30"></div>
                <span className="text-xs">Premium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-purple-100 dark:bg-purple-900/30"></div>
                <span className="text-xs">VIP</span>
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
              <CardDescription>
                {showtime.theaterName} • {showtime.screenName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">{showtime.movieTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(showtime.date)} • {showtime.startTime}
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
                          {seat.row}-{seat.number} ({seat.type})
                        </span>
                        <span>${seat.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedSeats.length > 0 && (
                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
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
  );
}
