import { Injectable } from '@angular/core';
import Movie from '../models/movie.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor() { }

  getMovies():Observable<Movie[]> {
    return new Observable
  }

  createMovie(movie: Partial<Movie>){
    return new Observable
  }

  updateMovie(id: number, movie: Partial<Movie>){
    return new Observable
  }

  deleteMovie(id: number) {
    return new Observable
  }
}
