package ma.cinecamera.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import ma.cinecamera.dto.req.MovieReqDto;
import ma.cinecamera.dto.resp.MovieRespDto;
import ma.cinecamera.model.Movie;

@Service
public interface IMovieService {

	Optional<Movie> getMovieById(Long id);

	MovieRespDto getMovieDetail(Long id);

	List<MovieRespDto> getAllMovies(Integer page);

	MovieRespDto createMovie(MovieReqDto dto);

	MovieRespDto updateMovie(MovieReqDto dto);

	void deleteMovie(Long id);

}
