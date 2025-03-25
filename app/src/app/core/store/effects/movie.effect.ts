import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as MovieActions from '../actions/movie.action';
import { MovieService } from '../../services/movie.service';
import Movie from '../../models/movie.model';

@Injectable()
export class MovieEffects {
  loadMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loadMovies),
      mergeMap(() =>
        this.movieService.getMovies().pipe(
          map((movies: Movie[]) => MovieActions.loadMoviesSuccess({ movies })),
          catchError((error) =>
            of(MovieActions.loadMoviesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.addMovie),
      mergeMap(({ movie }) =>
        this.movieService.createMovie(movie).pipe(
          map((newMovie: any) => MovieActions.addMovieSuccess({ movie: newMovie })),
          catchError((error) =>
            of(MovieActions.addMovieFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.updateMovie),
      mergeMap(({ id, movie }) =>
        this.movieService.updateMovie(id, movie).pipe(
          map((updatedMovie:any) =>
            MovieActions.updateMovieSuccess({ movie: updatedMovie })
          ),
          catchError((error) =>
            of(MovieActions.updateMovieFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.deleteMovie),
      mergeMap(({ id }) =>
        this.movieService.deleteMovie(id).pipe(
          map(() => MovieActions.deleteMovieSuccess({ id })),
          catchError((error) =>
            of(MovieActions.deleteMovieFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private movieService: MovieService
  ) {}
}
