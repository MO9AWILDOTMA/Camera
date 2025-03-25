import Movie from "../../models/movie.model";

export interface MovieState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

export const initialMovieState: MovieState = {
  movies: [],
  loading: false,
  error: null,
};
