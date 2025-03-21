import Movie from "../../models/movie.model";

export interface MoviesState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

export const initialMoviesState: MoviesState = {
  movies: [],
  loading: false,
  error: null,
};
