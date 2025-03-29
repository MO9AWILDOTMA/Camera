"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Showtime, { ShowVersion } from "@/models/showtime.model";
import Movie, { Genre } from "@/models/movie.model";
import { showtimesApi } from "@/lib/api";
import Loading from "@/app/loading";

type GroupedShowtimes = {
  [date: string]: {
    [theaterId: string]: {
      theaterName: string;
      showtimes: Showtime[];
    };
  };
};

type paramType = { slug: string } | any;

export default function ShowtimesPage({ params }: { params: paramType }) {
  const unwrappedParams: any = use(params);
  const slug = unwrappedParams.slug;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [groupedShowtimes, setGroupedShowtimes] = useState<GroupedShowtimes>(
    {}
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMovieAndShowtimes = async () => {
      try {
        const showtimesResponse = await showtimesApi.getById(slug);
        console.log(showtimesResponse);

        const mockMovie: Movie = {
          id: 1,
          name: "Interstellar",
          slug: slug,
          description:
            "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
          genres: [Genre.SCIENCE_FICTION],
          releaseDate: "2023-07-15",
          duration: 165,
          actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
          picturePaths: ["/placeholder.svg?height=600&width=400"],
          status: "RELEASED",
        };

        // Generate dates for the next 7 days
        const dates = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i);
          return date.toISOString().split("T")[0];
        });

        // Generate mock showtimes for each date
        const mockShowtimes: Showtime[] = [];
        const theaters = [
          { id: 1, name: "CineTix Downtown", screen: "Screen 1" },
          { id: 2, name: "CineTix Westside", screen: "Screen 3" },
        ];

        dates.forEach((date) => {
          // Add showtimes for theater 1
          ["10:00", "14:30", "19:00"].forEach((time, index) => {
            mockShowtimes.push({
              id: index + 1,
              slug: `${date}-${time}-1`,
              dateTime: `${date}T${time}:00`,
              price: 12.99,
              movie: mockMovie,
              discounts: [
                { id: 1, name: "Student", percentage: 15 },
                { id: 2, name: "Senior", percentage: 10 },
              ],
              showVersion: ShowVersion.VO,
              totalSeats: 120,
              reservedSeats: 45,
              isPreview: false,
              isSpecialEvent: false,
            });
          });

          // Add showtimes for theater 2
          ["11:30", "18:00"].forEach((time, index) => {
            mockShowtimes.push({
              id: index + 100,
              slug: `${date}-${time}-2`,
              dateTime: `${date}T${time}:00`,
              price: 14.99,
              movie: mockMovie,
              discounts: [
                { id: 1, name: "Student", percentage: 15 },
                { id: 2, name: "Senior", percentage: 10 },
              ],
              showVersion: ShowVersion.VOST_EN,
              totalSeats: 150,
              reservedSeats: 60,
              isPreview: false,
              isSpecialEvent: false,
            });
          });
        });

        setMovie(mockMovie);
        setShowtimes(mockShowtimes);

        // Set the default selected date to today
        setSelectedDate(dates[0]);

        // Group showtimes by date and theater
        const grouped: GroupedShowtimes = {};
        mockShowtimes.forEach((showtime) => {
          const date = showtime.dateTime.split("T")[0];
          const theaterId = showtime.slug.split("-").pop() || "1";

          if (!grouped[date]) {
            grouped[date] = {};
          }

          const theaterName =
            theaterId === "1" ? "CineTix Downtown" : "CineTix Westside";

          if (!grouped[date][theaterId]) {
            grouped[date][theaterId] = {
              theaterName: theaterName,
              showtimes: [],
            };
          }

          grouped[date][theaterId].showtimes.push(showtime);
        });

        setGroupedShowtimes(grouped);
      } catch (error) {
        console.error("Failed to fetch movie and showtimes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndShowtimes();
  }, [unwrappedParams.slug]);

  const handleSelectShowtime = (showtimeSlug: string) => {
    router.push(`/booking/${showtimeSlug}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getStartTime = (dateTime: string) => {
    return dateTime.split("T")[1].substring(0, 5);
  };

  if (loading) {
    return <Loading />;
  }

  // Get unique dates from showtimes
  const dates = Object.keys(groupedShowtimes).sort();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-8 md:flex-row">
        <div className="h-[400px] w-full max-w-[300px] overflow-hidden rounded-lg">
          <img
            src={movie?.picturePaths[0] || "/placeholder.svg"}
            alt={movie?.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="mb-2 text-3xl font-bold">{movie?.name}</h1>
          <div className="mb-4 flex flex-wrap gap-2">
            {movie?.genres.map((genre) => (
              <span
                key={genre}
                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary"
              >
                {genre.replace("_", " ")}
              </span>
            ))}
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-sm font-medium">
              <Clock className="h-3 w-3" />
              {Math.floor((movie?.duration || 0) / 60)}h{" "}
              {(movie?.duration || 0) % 60}m
            </span>
          </div>
          <p className="mb-4 text-muted-foreground">
            <strong>Actors:</strong> {movie?.actors.join(", ")}
          </p>
          <p className="mb-6">{movie?.description}</p>
          <div className="flex gap-4">
            <Button variant="outline">
              <Film className="mr-2 h-4 w-4" />
              Watch Trailer
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-6 text-2xl font-bold">Showtimes</h2>

        <Tabs value={selectedDate} onValueChange={setSelectedDate}>
          <TabsList className="mb-6 flex w-full overflow-x-auto">
            {dates.map((date) => (
              <TabsTrigger key={date} value={date} className="flex-1">
                <div className="flex flex-col items-center">
                  <span className="text-xs">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(date).getDate()}
                  </span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {dates.map((date) => (
            <TabsContent key={date} value={date}>
              <div className="space-y-6">
                {Object.entries(groupedShowtimes[date] || {}).map(
                  ([theaterId, theaterData]) => (
                    <Card key={theaterId}>
                      <CardHeader>
                        <CardTitle>{theaterData.theaterName}</CardTitle>
                        <CardDescription>
                          <Calendar className="mr-1 inline-block h-4 w-4" />
                          {formatDate(date)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-3">
                          {theaterData.showtimes.map((showtime) => (
                            <Button
                              key={showtime.id}
                              variant="outline"
                              onClick={() =>
                                handleSelectShowtime(showtime.slug)
                              }
                            >
                              {getStartTime(showtime.dateTime)}
                              <span className="ml-2 text-xs text-muted-foreground">
                                {showtime.showVersion}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
