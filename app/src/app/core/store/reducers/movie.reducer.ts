import { createReducer, on } from '@ngrx/store';
import { MovieState, initialMovieState } from '../states/movie.state';
import * as MovieActions from '../actions/movie.action';

export const movieReducer = createReducer(
  initialMovieState,
  // Load Movies
  on(MovieActions.loadMovies, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MovieActions.loadMoviesSuccess, (state, { movies }) => ({
    ...state,
    movies,
    loading: false,
    error: null,
  })),
  on(MovieActions.loadMoviesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add Movie
  on(MovieActions.addMovie, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MovieActions.addMovieSuccess, (state, { movie }) => ({
    ...state,
    movies: [...state.movies, movie],
    loading: false,
    error: null,
  })),
  on(MovieActions.addMovieFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Movie
  on(MovieActions.updateMovie, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MovieActions.updateMovieSuccess, (state, { movie }) => ({
    ...state,
    movies: state.movies.map((m) => (m.id === movie.id ? movie : m)),
    loading: false,
    error: null,
  })),
  on(MovieActions.updateMovieFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Movie
  on(MovieActions.deleteMovie, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(MovieActions.deleteMovieSuccess, (state, { id }) => ({
    ...state,
    movies: state.movies.filter((movie) => movie.id !== id),
    loading: false,
    error: null,
  })),
  on(MovieActions.deleteMovieFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
