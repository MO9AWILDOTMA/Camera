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
import api, { showtimesApi } from "@/lib/api";
import Loading from "@/app/loading";
import GlobalLayout from "@/components/home/layout";

type GroupedShowtimes = {
  [date: string]: {
    [screenId: number]: {
      screenName: string;
      showtimes: Showtime[];
    };
  };
};
const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function ShowtimesPage({ params }: { params: any }) {
  const unwrapedParams: any = use(params);
  const movieId = unwrapedParams.movieId;
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
        const response = await showtimesApi.getByMovie(movieId);
        const data = response.data;
        if (!data || data.length === 0) return;

        const movieData = data[0].movie;
        setShowtimes(data);
        setMovie(movieData);

        // Generate dates for the next 7 days
        const dates = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i);
          return date.toISOString().split("T")[0];
        });

        // Group showtimes by date and screen
        const grouped: GroupedShowtimes = {};
        data.forEach((showtime: Showtime) => {
          const date = showtime.dateTime.split("T")[0];
          const screen = showtime.screeningRoom;

          if (!grouped[date]) {
            grouped[date] = {};
          }

          if (!grouped[date][screen.id]) {
            grouped[date][screen.id] = {
              screenName: screen.name,
              showtimes: [],
            };
          }

          grouped[date][screen.id].showtimes.push(showtime);
        });

        setGroupedShowtimes(grouped);

        // Set the default selected date to today if available, otherwise first available date
        const availableDates = Object.keys(grouped);
        if (availableDates.length > 0) {
          setSelectedDate(availableDates[0]);
        }
      } catch (error) {
        console.error("Failed to fetch movie and showtimes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndShowtimes();
  }, [movieId]);

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

  const picture = movie?.picturePaths[0]
    ? API_URL + movie?.picturePaths[0]
    : "/placeholder.svg";

  if (loading) {
    return <Loading />;
  }

  // Get unique dates from showtimes
  const dates = Object.keys(groupedShowtimes).sort();

  return (
    <GlobalLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-8 md:flex-row">
          <div className="h-[400px] w-full max-w-[300px] overflow-hidden rounded-lg">
            <img
              src={picture}
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

          {dates.length > 0 ? (
            <Tabs value={selectedDate} onValueChange={setSelectedDate}>
              <TabsList className="mb-6 flex w-full h-full overflow-x-auto">
                {dates.map((date) => (
                  <TabsTrigger key={date} value={date} className="flex-1 ">
                    <div className="flex flex-col items-center py-6 w-full bg-slate-100 hover:bg-slate-200">
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
                      ([screenId, screenData]) => (
                        <Card key={screenId}>
                          <CardHeader>
                            <CardTitle>{screenData.screenName}</CardTitle>
                            <CardDescription>
                              <Calendar className="mr-1 inline-block h-4 w-4" />
                              {formatDate(date)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-3">
                              {screenData.showtimes.map((showtime) => (
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
          ) : (
            <p className="text-muted-foreground">No showtimes available</p>
          )}
        </div>
      </div>
    </GlobalLayout>
  );
}
