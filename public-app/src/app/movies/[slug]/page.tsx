import React from "react";
import MovieDetails from "./movieDetails";
import { fetchMovieDetails, fetchMovies } from "@/apis/fetchMovies";

// Generate static params for all available movie slugs
export async function generateStaticParams() {
  try {
    const response = await fetchMovies(100); // Fetch a large number of movies to get all possible slugs
    return response.data.map((movie) => ({
      slug: movie.slug,
    }));
  } catch (error) {
    console.error("Error generating static params for movies:", error);
    // Return fallback movies to prevent build failures
    return [
      { slug: "default-movie" },
      { slug: "avengers-endgame" },
      { slug: "joker" },
      { slug: "inception" },
      { slug: "the-dark-knight" },
    ];
  }
}

// This is now a Server Component
async function Movie({ params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const movieData = await fetchMovieDetails(slug);
    const movie = movieData.data;

    return (
      <>
        <MovieDetails movie={movie} />
      </>
    );
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Movie Not Found
          </h1>
          <p className="text-gray-600">
            Sorry, we couldn't find the movie you're looking for.
          </p>
          <a
            href="/movies"
            className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Browse Movies
          </a>
        </div>
      </div>
    );
  }
}

export default Movie;
