"use client";

import { fetchMovieShowtimes } from "@/apis/fetchMovies";
import Loading from "@/components/loading";
import ShowtimeCard from "@/components/showtime-card";
import { Movie, MovieStatus } from "@/models/Movie";
import Showtime from "@/models/Showtime";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const DASH_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL;

const MovieDetails = ({ movie }: { movie: Movie }) => {
  const [showtimes, setShowtimes] = useState<Showtime[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  const picture =
    movie.picturePaths && movie.picturePaths.length > 0
      ? BASE_URL + movie.picturePaths[0]
      : "/image/event.jpeg";

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const resp = await fetchMovieShowtimes(movie.id);
        setShowtimes(resp.data);

        // Set active date to the first available date
        if (resp.data.length > 0) {
          const firstDate = new Date(resp.data[0].dateTime).toDateString();
          setActiveDate(firstDate);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movie]);

  // Get unique dates from showtimes
  const uniqueDates = Array.from(
    new Set(showtimes.map((st) => new Date(st.dateTime).toDateString()))
  );

  // Group showtimes by date
  const showtimesByDate = uniqueDates.reduce(
    (acc, date) => {
      acc[date] = showtimes.filter(
        (st) => new Date(st.dateTime).toDateString() === date
      );
      return acc;
    },
    {} as Record<string, Showtime[]>
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge style
  const getStatusBadgeStyle = (status: MovieStatus) => {
    switch (status) {
      case MovieStatus.NOW_SHOWING:
        return "bg-green-500";
      case MovieStatus.COMING_SOON:
        return "bg-blue-500";
      case MovieStatus.PREMIERES_FRIDAY:
        return "bg-purple-500";
      case MovieStatus.FINAL_WEEK:
        return "bg-red-500";
      case MovieStatus.SPECIAL_SCREENING:
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  // Truncate description for initial view
  const truncateDescription = (text: string, maxLength: number = 250) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-black h-full">
      <div className="max-w-7xl mx-auto px-4 py-28">
        {/* Hero Section */}
        <div className="relative mb-8 rounded-xl overflow-hidden">
          {/* Hero Background */}
          <div className="w-full h-96 relative">
            {movie.picturePaths.length > 0 && (
              <>
                {/* Backdrop image with overlay */}
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <Image
                  src={picture}
                  alt={movie.name}
                  fill
                  className="object-cover"
                  priority
                />
              </>
            )}
          </div>

          {/* Content overlay */}
          <div className="absolute inset-0 z-20 flex items-center px-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Movie Poster */}
              <div className="w-64 h-80 shrink-0 rounded-lg overflow-hidden shadow-2xl">
                {movie.picturePaths.length > 0 && (
                  <Image
                    src={picture}
                    alt={movie.name}
                    width={256}
                    height={320}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Movie Info */}
              <div className="text-white">
                <div className="mb-4">
                  <h1 className="text-4xl font-bold mb-2">{movie.name}</h1>
                  <div
                    className={`inline-block px-3 py-1 text-sm font-bold text-white rounded-full ${getStatusBadgeStyle(movie.status)}`}
                  >
                    {movie.status}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-200">
                    {showMore
                      ? movie.description
                      : truncateDescription(movie.description)}
                  </p>
                  {movie.description.length > 250 && (
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="text-blue-400 hover:text-blue-300 mt-2"
                    >
                      {showMore ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Showtimes Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Showtimes</h2>

          {/* Date tabs */}
          {uniqueDates.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2 mb-6">
                {uniqueDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setActiveDate(date)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      activeDate === date
                        ? "bg-red-800 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>

              {/* Showtimes for selected date */}
              {activeDate && showtimesByDate[activeDate].length > 0 ? (
                <div className="space-y-4">
                  {showtimesByDate[activeDate].map(
                    (showtime: Showtime, index: number) => (
                      <ShowtimeCard
                        key={showtime.id}
                        showtime={showtime}
                        colorTheme={"red"}
                      />
                    )
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No showtimes available for this date.
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-500 italic">
              No showtimes available for this movie.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
