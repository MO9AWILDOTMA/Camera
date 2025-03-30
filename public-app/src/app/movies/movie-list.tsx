"use client";

import { fetchMovies, searchForMovies } from "@/apis/fetchMovies";
import Alert from "@/components/alert";
import Loading from "@/components/loading";
import Search from "@/components/search";
import { Pagination } from "@/components/pagination";
import { Movie } from "@/models/Movie";
import React, { useEffect, useState } from "react";
import MovieCard from "@/components/movie-card";

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Parent-managed search term
  const [genre, setGenre] = useState(""); // Parent-managed genre
  const size = 6;

  // Fetch movies based on current state
  const getMovies = async () => {
    try {
      setLoading(true);
      const resp =
        searchTerm.trim().length > 0
          ? await searchForMovies(searchTerm, genre, size, currentPage)
          : await fetchMovies(size, currentPage);
      setMovies(resp.data.content || []);
      setTotalPages(resp.data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch movies when page, search term, or genre changes
  useEffect(() => {
    getMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, genre]);

  // Alert timeout
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // Handle search
  const handleSearch = (selectedGenre: string, term: string) => {
    setSearchTerm(term); // Update search term in parent
    setGenre(selectedGenre); // Update genre in parent
    setCurrentPage(1); // Reset to first page
    if (!term.trim()) {
      setShowAlert(true);
      // Show alert if search term is empty
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <Loading />;
  }

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
          <Search
            selectedGenre={genre} // Pass selected genre to Search component
            onSearch={handleSearch} // Pass search handler
          />
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

      {movies.length > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            active={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default MoviesList;
