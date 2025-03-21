import { createSelector } from '@ngrx/store';
import { MovieState } from '../states/movie.state';
import Movie from '../../models/movie.model';

export const selectMovieState = (state: { movie: MovieState }) => state.movie;

export const selectMovies = createSelector(
  selectMovieState,
  (state: MovieState) => state.movies
);

export const selectMovieLoading = createSelector(
  selectMovieState,
  (state: MovieState) => state.loading
);

export const selectMovieError = createSelector(
  selectMovieState,
  (state: MovieState) => state.error
);

export const selectMovieById = (id: number) =>
  createSelector(selectMovies, (movies: Movie[]) =>
    movies.find((movie) => movie.id === id)
  );
