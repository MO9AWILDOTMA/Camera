import { createAction, props } from '@ngrx/store';
import Movie from '../../models/movie.model';

// Load (Read) Movies
export const loadMovies = createAction('[Movie] Load Movies');
export const loadMoviesSuccess = createAction('[Movie] Load Movies Success', props<{ movies: Movie[] }>());
export const loadMoviesFailure = createAction('[Movie] Load Movies Failure', props<{ error: string }>());

// Create Movie
export const addMovie = createAction('[Movie] Add Movie', props<{ movie: Partial<Movie> }>());
export const addMovieSuccess = createAction('[Movie] Add Movie Success', props<{ movie: Movie }>());
export const addMovieFailure = createAction('[Movie] Add Movie Failure', props<{ error: string }>());

// Update Movie
export const updateMovie = createAction('[Movie] Update Movie', props<{ id: number; movie: Partial<Movie> }>());
export const updateMovieSuccess = createAction('[Movie] Update Movie Success', props<{ movie: Movie }>());
export const updateMovieFailure = createAction('[Movie] Update Movie Failure', props<{ error: string }>());

// Delete Movie
export const deleteMovie = createAction('[Movie] Delete Movie', props<{ id: number }>());
export const deleteMovieSuccess = createAction('[Movie] Delete Movie Success', props<{ id: number }>());
export const deleteMovieFailure = createAction('[Movie] Delete Movie Failure', props<{ error: string }>());
