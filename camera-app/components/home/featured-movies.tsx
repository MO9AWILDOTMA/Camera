"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loading from "@/app/loading";
import { showtimesApi } from "@/lib/api";
import Movie, { Genre } from "@/models/movie.model";
import Showtime from "@/models/showtime.model";
import { setInterval } from "timers";

const mockMovies: Partial<Movie>[] = [
  {
    id: 1,
    name: "Interstellar",
    picturePaths: ["/placeholder.svg?height=600&width=400"],
    releaseDate: "2023-07-15",
    duration: 165,
    genres: [Genre.SCIENCE_FICTION],
  },
  {
    id: 2,
    name: "The Dark Knight",
    picturePaths: ["/placeholder.svg?height=600&width=400"],
    releaseDate: "2023-08-10",
    duration: 152,
    genres: [Genre.ACTION],
  },
  {
    id: 3,
    name: "Inception",
    picturePaths: ["/placeholder.svg?height=600&width=400"],
    releaseDate: "2023-06-22",
    duration: 148,
    genres: [Genre.THRILLER],
  },
];
const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const PUBLIC_URl = process.env.NEXT_PUBLIC_PUBLIC_WEBSITE_URL;

export function FeaturedMovies() {
  const [movies, setMovies] = useState<Partial<Movie>[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentMovie, setCurrentMovie] = useState<Partial<Movie> | null>(null);
  const [totalMovies, setTotalMovies] = useState(0);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        const response = await showtimesApi.getAll(1, 6);
        const data = response.data;
        if (data && data.content) {
          let movieArray: Movie[] = [];
          data.content.forEach((showtime: Showtime) => {
            const exists = movieArray.some(
              (movie) => movie.id === showtime.movie.id
            );

            if (!exists) {
              movieArray.push(showtime.movie);
            }
          });
          setMovies(movieArray);
          setShowtimes(data.content);
          setCurrentMovie(movieArray[0]);
          setTotalMovies(movieArray.length);
        } else setMovies(mockMovies);
      } catch (error) {
        console.error("Failed to fetch featured movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMovies();
  }, []);

  useEffect(() => {
    setCurrentMovie(movies[currentIndex]);
  }, [currentIndex]);

  const nextSlide = () => {
    if (currentIndex + 1 >= totalMovies) setCurrentIndex(0);
    else setCurrentIndex((prevIndex) => (prevIndex + 1) % showtimes.length);
  };

  const prevSlide = () => {
    if (currentIndex === 0) setCurrentIndex(totalMovies - 1);
    else
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + showtimes.length) % showtimes.length
      );
  };

  if (loading) {
    return <Loading />;
  }

  if (movies.length === 0 || !currentMovie) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="relative h-[400px] md:h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${API_URL}${currentMovie.picturePaths![0] || ""})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container px-4 md:px-6">
            <div className="max-w-md space-y-4 text-white">
              <h1 className="text-3xl font-bold md:text-4xl">
                {currentMovie.name}
              </h1>
              <p className="text-sm md:text-base">
                {currentMovie.genres![0]} •{" "}
                {Math.floor(currentMovie.duration! / 60)}h{" "}
                {currentMovie.duration! % 60}m
              </p>
              <p className="text-sm md:text-base">
                Release Date:{" "}
                {new Date(currentMovie.releaseDate!).toLocaleDateString()}
              </p>
              <div className="flex gap-4">
                <Link href={`${PUBLIC_URl}/movies/${currentMovie.slug}`}>
                  <Button>View Details</Button>
                </Link>
                <Link href={`/showtimes/${currentMovie.id}`}>
                  <Button
                    variant="outline"
                    className="text-black hover:bg-gray-300"
                  >
                    Book Tickets
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Previous</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Next</span>
      </Button>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentIndex(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
