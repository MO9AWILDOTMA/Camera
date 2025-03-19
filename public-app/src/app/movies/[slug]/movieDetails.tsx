import { Movie } from "@/models/Movie";
import React from "react";

const MovieDetails = ({ movie }: { movie: Movie }) => {
  return <div className="h-screen">{movie.name}</div>;
};

export default MovieDetails;
