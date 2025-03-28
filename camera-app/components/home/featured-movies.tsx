"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loading from "@/app/loading";

type Movie = {
  id: string;
  title: string;
  posterUrl: string;
  releaseDate: string;
  duration: number;
  genre: string;
};

export function FeaturedMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        // For demo purposes, we'll use placeholder data
        // In a real app, you would use: const response = await moviesApi.getFeatured()
        const mockMovies: Movie[] = [
          {
            id: "1",
            title: "Interstellar",
            posterUrl: "/placeholder.svg?height=600&width=400",
            releaseDate: "2023-07-15",
            duration: 165,
            genre: "Sci-Fi",
          },
          {
            id: "2",
            title: "The Dark Knight",
            posterUrl: "/placeholder.svg?height=600&width=400",
            releaseDate: "2023-08-10",
            duration: 152,
            genre: "Action",
          },
          {
            id: "3",
            title: "Inception",
            posterUrl: "/placeholder.svg?height=600&width=400",
            releaseDate: "2023-06-22",
            duration: 148,
            genre: "Thriller",
          },
        ];
        setMovies(mockMovies);
      } catch (error) {
        console.error("Failed to fetch featured movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMovies();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + movies.length) % movies.length
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (movies.length === 0) {
    return null;
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="relative h-[400px] md:h-[500px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentMovie.posterUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container px-4 md:px-6">
            <div className="max-w-md space-y-4 text-white">
              <h1 className="text-3xl font-bold md:text-4xl">
                {currentMovie.title}
              </h1>
              <p className="text-sm md:text-base">
                {currentMovie.genre} • {Math.floor(currentMovie.duration / 60)}h{" "}
                {currentMovie.duration % 60}m
              </p>
              <p className="text-sm md:text-base">
                Release Date:{" "}
                {new Date(currentMovie.releaseDate).toLocaleDateString()}
              </p>
              <div className="flex gap-4">
                <Link href={`/movies/${currentMovie.id}`}>
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
