"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
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

export function UpcomingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const api = "http://localhost:8080";

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        const response = await moviesApi.getUpcoming();
        const mockMovies: Movie[] = [
          {
            id: "5",
            name: "Dune: Part Two",
            picturePaths: ["/placeholder.svg?height=600&width=400"],
            releaseDate: "2023-11-20",
            duration: 155,
            genres: ["Sci-Fi"],
          },
          {
            id: "6",
            name: "The Marvels",
            picturePaths: ["/placeholder.svg?height=600&width=400"],
            releaseDate: "2023-12-05",
            duration: 132,
            genres: ["Action"],
          },
          {
            id: "7",
            name: "Oppenheimer",
            picturePaths: ["/placeholder.svg?height=600&width=400"],
            releaseDate: "2023-10-15",
            duration: 180,
            genres: ["Drama"],
          },
          {
            id: "8",
            name: "Mission: Impossible 8",
            picturePaths: ["/placeholder.svg?height=600&width=400"],
            releaseDate: "2023-12-25",
            duration: 145,
            genres: ["Action"],
          },
        ];
        setMovies(response.data || mockMovies);
      } catch (error) {
        console.error("Failed to fetch upcoming movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMovies();
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
            <Badge className="absolute right-2 top-2 bg-primary">
              Coming Soon
            </Badge>
          </div>
          <CardHeader className="p-4">
            <CardTitle className="line-clamp-1 text-lg">{movie.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {movie.genres[1]} • {Math.floor(movie.duration / 60)}h{" "}
              {movie.duration % 60}m
            </p>
            <p className="text-sm text-muted-foreground">
              Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardFooter className="p-4 pt-0">
            <Button variant="outline" className="w-full">
              Notify Me
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
