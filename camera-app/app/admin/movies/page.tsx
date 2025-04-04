"use client";

import React, { useEffect, useState } from "react";
import Table from "../../../components/admin/table";
import { moviesApi } from "@/lib/api";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Film, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Movie from "@/models/movie.model";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "duration", label: "Duration (min)" },
  {
    key: "releaseDate",
    label: "Release Date",
    render: (item: Movie) => new Date(item.releaseDate).toLocaleDateString(),
  },
  {
    key: "status",
    label: "Status",
    render: (item: Movie) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          item.status === "Released"
            ? "bg-green-100 text-green-800"
            : item.status === "Coming Soon"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
        }`}
      >
        {item.status}
      </span>
    ),
  },
];

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await moviesApi.getAll(page, size);
        const data = response.data;

        setMovies(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load movies",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page, size]);

  const showMovie = (movie: Movie) => {
    router.push(`/admin/movies/${movie.slug}`);
  };

  const handleDelete = async (item: Movie) => {
    try {
      await moviesApi.delete(item.id);
      toast({
        title: "Success",
        description: "Movie deleted successfully!",
      });
      // Refresh the list
      setPage(1);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete movie",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (movie: Movie) => {
    router.push(`/admin/movies/update/${movie.slug}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Movies Management</h2>
        <Button onClick={() => router.push("/admin/movies/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Movie
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table
          data={movies}
          onDelete={handleDelete}
          onShow={showMovie}
          onEdit={handleEdit}
          columns={columns}
          showActions={true}
        />

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm">
                    Page {page} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
