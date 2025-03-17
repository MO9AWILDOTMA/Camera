"use client";

import React, { useState, useEffect, useCallback } from "react";
import { IconButton, Button, Typography } from "@material-tailwind/react";
import type {
  IconButtonProps,
  ButtonProps,
  TypographyProps,
} from "@material-tailwind/react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { fetchMovies } from "@/apis/fetchMovies";
import { HeroMovie, Movie } from "@/models/Movie";
import { movieMapper } from "@/utils/MovieMapper";
import { useRouter } from "next/navigation";

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
        const resp = await fetchMovies();
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
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
