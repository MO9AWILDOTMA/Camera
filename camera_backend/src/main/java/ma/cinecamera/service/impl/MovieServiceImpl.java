package ma.cinecamera.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import ma.cinecamera.dto.req.MovieReqDto;
import ma.cinecamera.dto.resp.MovieRespDto;
import ma.cinecamera.mapper.MovieMapper;
import ma.cinecamera.model.Movie;
import ma.cinecamera.repository.IMovieRepository;
import ma.cinecamera.service.IMovieService;

@Service
@AllArgsConstructor
public class MovieServiceImpl implements IMovieService {

	private IMovieRepository repository;
	private MovieMapper mapper;

	@Override
	public Optional<Movie> getMovieById(Long id) {
		// TODO Auto-generated method stub
		return Optional.empty();
	}

	@Override
	public MovieRespDto getMovieDetail(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<MovieRespDto> getAllMovies(Integer page) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public MovieRespDto createMovie(MovieReqDto dto) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public MovieRespDto updateMovie(MovieReqDto dto) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteMovie(Long id) {
		// TODO Auto-generated method stub

	}
}
