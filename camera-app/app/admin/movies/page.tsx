"use client";

import React, { useEffect, useState } from "react";
import MoviesTable from "../../../components/admin/table";
import { Column } from "@/types/table-types";
import { moviesApi } from "@/lib/api";
import Loading from "@/app/loading";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  {
    key: "Created At",
    label: "createdAt",
  },
  {
    key: "Updates At",
    label: "updatedAt",
  },
];
const Movies = () => {
  const [movies, setMovies] = useState();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const showMovie = () => {};

  if (loading) return <Loading />;
  return (
    <div>
      <div>
        <h2 className="px-10 mb-4 font-bold text-2xl">Movies Managment</h2>
      </div>
      <MoviesTable data={movies} onShow={showMovie} columns={columns} />
    </div>
  );
};

export default Movies;
