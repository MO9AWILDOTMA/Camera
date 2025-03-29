"use client";

import React, { useEffect, useState } from "react";
import MoviesTable from "../../../components/admin/table";
import { Column } from "@/types/table-types";
import { moviesApi } from "@/lib/api";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Film } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Movie from "@/models/movie.model";

const columns = [
  { key: "name", label: "Name" },
  { key: "duration", label: "Duration (min)" },
  { key: "releaseDate", label: "Release Date" },
  { key: "status", label: "Status" },
];
const Movies = () => {
  const [movies, setMovies] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await moviesApi.getAll(page, size);
        const data = response.data;

        setMovies(data.content || []);
        // setPage(data)
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [loading]);

  const showMovie = () => {};

  const handleDelete = async (item: Movie) => {
    setLoading(true);
    try {
      await moviesApi.delete(item.id);
      toast({
        title: "Deleting successful",
        description: "Movie deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Deleting failed",
        description: error.response.data.message || "Movie Deletings Failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (movie: Movie) => {
    router.push(`/admin/movies/update/${movie.slug}`);
  };
  if (loading) return <Loading />;
  return (
    <div>
      <div className="flex justify-between items-center lg:flex-nowrap flex-wrap md:flex-nowrap">
        <h2 className="px-10 mb-4 font-bold text-2xl">Movies Managment</h2>
        <div>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push("movies/create")}
          >
            <Film className="mr-2 h-4 w-4" />
            Create New Movie
          </Button>
        </div>
      </div>
      <MoviesTable
        data={movies}
        onDelete={handleDelete}
        onShow={showMovie}
        onEdit={handleEdit}
        columns={columns}
      />
    </div>
  );
};

export default Movies;
