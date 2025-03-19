"use client";

import { fetchMovies, searchForMovies } from "@/apis/fetchMovies";
import Alert from "@/components/alert";
import Loading from "@/components/loading";
import MovieCard from "@/components/movie-card";
import Search from "@/components/search";
import { Movie } from "@/models/Movie";
import React, { useEffect, useState } from "react";

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const resp = await fetchMovies();
        setMovies(resp.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (!searching) getMovies();
  }, [searching]);

  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  }, [showAlert]);

  if (loading) {
    return <Loading />;
  }

  const handleSearch = async (selectedGenre: string, searchTerm: string) => {
    console.log(`Searching for "${searchTerm}" with genres: ${selectedGenre}`);
    if (searchTerm.trim().length > 0) {
      try {
        setSearching(true);
        const resp = await searchForMovies(searchTerm, selectedGenre);
        setMovies(resp.data);
      } catch (error) {
        console.error(error);
      }
    } else {
      setShowAlert(true);
      setSearching(false);
    }
  };

  return (
    <div className="px-10 py-12">
      <Alert
        color="warning"
        title="Warning!"
        message="Make sure to enter the search term"
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        autoClose={true}
      />

      <div className="flex justify-center items-center">
        <div>
          <Search searching={searching} onSearch={handleSearch} />
        </div>
      </div>
      <div className="flex flex-wrap gap-6 justify-center py-10">
        {movies.map((movie: Movie, index: number) => (
          <MovieCard
            slug={movie.slug}
            title={movie.name}
            imageSrc={movie.picturePaths[0]}
            description={movie.description}
            key={index}
          />
        ))}
        {movies.length == 0 && <div>List is empty</div>}
      </div>

      <div className="text-center">pagination</div>
    </div>
  );
};

export default MoviesList;
