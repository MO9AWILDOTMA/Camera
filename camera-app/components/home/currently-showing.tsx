"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { moviesApi } from "@/lib/api";

type Movie = {
  id: string;
  name: string;
  picturePaths: string[];
  releaseDate: string;
  duration: number;
  genres: string[];
};

export function CurrentlyShowing() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const api = "http://localhost:8080";

  useEffect(() => {
    const fetchCurrentMovies = async () => {
      try {
        const response = await moviesApi.getUpcoming();
        const mockMovies: Movie[] = [
          {
            id: "1",
            name: "Interstellar",
            picturePaths: ["/placeholder.svg?height=600&width=400"],
            releaseDate: "2023-07-15",
            duration: 165,
            genres: ["Sci-Fi"],
          },
          {
            id: "2",
            name: "The Dark Knight",
            picturePaths: ["/placeholder.svg?height=600&width=400"],
            releaseDate: "2023-08-10",
            duration: 152,
            genres: ["Action"],
          },
          {
            id: "3",
            name: "Inception",
            picturePaths: ["/placeholder.svg?height=600&width=400"],
            releaseDate: "2023-06-22",
            duration: 148,
            genres: ["Thriller"],
          },
          {
            id: "4",
            name: "The Shawshank Redemption",
            picturePaths: ["/placeholder.svg?height=600&width=400"],
            releaseDate: "2023-05-14",
            duration: 142,
            genres: ["Drama"],
          },
        ];
        setMovies(response.data || mockMovies);
      } catch (error) {
        console.error("Failed to fetch current movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentMovies();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="h-[300px] animate-pulse bg-muted"></div>
            <CardHeader className="animate-pulse bg-muted h-10 mt-2"></CardHeader>
            <CardFooter className="animate-pulse bg-muted h-10 mt-2 mb-4 mx-4"></CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {movies.map((movie) => (
        <Card key={movie.id} className="overflow-hidden">
          <div className="relative h-[300px] overflow-hidden">
            <img
              src={api + movie.picturePaths[0] || "/placeholder.svg"}
              alt={movie.name}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <CardHeader className="p-4">
            <CardTitle className="line-clamp-1 text-lg">{movie.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {movie.genres[0]} • {Math.floor(movie.duration / 60)}h{" "}
              {movie.duration % 60}m
            </p>
          </CardHeader>
          <CardFooter className="p-4 pt-0">
            <Link href={`/showtimes/${movie.id}`} className="w-full">
              <Button className="w-full">Book Tickets</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
