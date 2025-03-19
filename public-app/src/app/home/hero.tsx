"use client";

import React, { useState, useEffect, useCallback } from "react";
import { IconButton, Button, Typography } from "@material-tailwind/react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { fetchUpcomingMovies } from "@/apis/fetchMovies";
import { HeroMovie, Movie } from "@/models/Movie";
import { movieMapper } from "@/utils/MovieMapper";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "@/components/loading-skeleton";

const initialCarouselContent: HeroMovie[] = [
  {
    id: 1,
    title: "Cinéma Caméra Meknès - Celebrating 2 Years Since Reopening",
    slug: "Cinéma-Caméra-Meknès-Celebrating-2-Years-Since-Reopening",
    description:
      "Join us for special screenings commemorating our successful revival since Aïd Al-Fitr 2023. The historic 650-seat venue continues to thrive with state-of-the-art digital projection.",
    image: "/image/camera-day.jpg",
    status: "Special Event",
    cta: "Book Tickets",
  },
  {
    id: 2,
    title: "Heritage Theater Tour",
    slug: "Heritage-Theater-Tour",
    description:
      "Discover the architectural beauty and history of Cinéma Caméra, from its construction by the Sandeaux family to the 2023 renovation that brought digital cinema to this historic venue.",
    image: "/image/camera-night.jpg",
    status: "Weekly Event",
    cta: "Reserve Spot",
  },
  {
    id: 3,
    title: "The Legacy of Meknès",
    slug: "The-Legacy-of-Meknès",
    description:
      "A critically acclaimed drama following three generations of a family in Meknès, filmed partially in our historic theater.",
    image: "/logos/camera-logo.jpg",
    status: "Now Showing",
    cta: "Book Tickets",
  },
];

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [movies, setMovies] = useState<HeroMovie[]>(initialCarouselContent);
  const [currentMovie, setCurrentMovie] = useState<HeroMovie>(movies[0]);
  const router = useRouter();

  // Memoize the slide functions
  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, movies.length]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + movies.length) % movies.length
    );
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, movies.length]);

  // Fetch movies on component mount
  useEffect(() => {
    const getMovies = async () => {
      try {
        const resp = await fetchUpcomingMovies();
        const mappedMovies = movieMapper(resp.data);
        setMovies(mappedMovies);
        setCurrentMovie(mappedMovies[0]); // Set initial movie
      } catch (error) {
        console.error("Failed to fetch movies:", error);
        // Keep using initial content in case of error
      } finally {
        setLoading(false);
      }
    };
    getMovies();
  }, []);

  // Update current movie when index changes
  useEffect(() => {
    setCurrentMovie(movies[currentIndex]);
  }, [currentIndex, movies]);

  // Handle auto-rotation separately
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  const handleCtaClick = (slug: string) => {
    setLoading(true);
    router.push("/movies/" + slug);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background images */}
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${movie.image})` }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 h-full w-full bg-gray-900/60" />

      {/* Content */}
      <div className="grid min-h-screen px-8">
        <div className="container relative z-10 my-auto mx-auto grid place-items-center text-center">
          <Typography
            placeholder=""
            variant="h3"
            color="white"
            className="mb-2"
          >
            {currentMovie.status}
          </Typography>
          <Typography
            placeholder=""
            variant="h1"
            color="white"
            className="lg:max-w-3xl"
          >
            {currentMovie.title}
          </Typography>
          <Typography
            placeholder=""
            variant="lead"
            color="white"
            className="mt-1 mb-12 w-full md:max-w-full lg:max-w-2xl"
          >
            {currentMovie.description}
          </Typography>
          <div className="flex items-center gap-4">
            <Button
              placeholder=""
              onClick={() => {
                handleCtaClick(currentMovie.slug);
              }}
              variant="gradient"
              color="white"
            >
              {currentMovie.cta}
            </Button>
            <IconButton
              placeholder=""
              className="rounded-full bg-white p-6"
              color="white"
            >
              <PlayIcon className="h-4 w-4 text-gray-900" />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="absolute inset-x-0 bottom-16 flex justify-center items-center gap-4 z-20">
        <IconButton
          placeholder=""
          variant="text"
          color="white"
          className="rounded-full"
          onClick={prevSlide}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </IconButton>

        <div className="flex items-center gap-2">
          {movies.map((_, index) => (
            <span
              key={index}
              className={`block h-2 w-2 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        <IconButton
          placeholder=""
          variant="text"
          color="white"
          className="rounded-full"
          onClick={nextSlide}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </IconButton>
      </div>
    </div>
  );
}

export default Hero;
