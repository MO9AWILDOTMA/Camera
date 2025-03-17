import { Movie } from "@/models/Movie";
import React from "react";

const MovieDetails = ({ movie }: { movie: Movie }) => {
  return <div>{movie.name}</div>;
};

export default MovieDetails;
