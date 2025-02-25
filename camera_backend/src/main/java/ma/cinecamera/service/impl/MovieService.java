package ma.cinecamera.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import ma.cinecamera.dto.req.MovieReqDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.MovieRespDto;
import ma.cinecamera.exception.ResourceNotFoundException;
import ma.cinecamera.mapper.MovieMapper;
import ma.cinecamera.model.Movie;
import ma.cinecamera.model.enums.MediaType;
import ma.cinecamera.repository.MovieRepository;
import ma.cinecamera.service.FileServiceInterface;
import ma.cinecamera.service.IMovieService;

@Service
@AllArgsConstructor
public class MovieService implements IMovieService {

    @Autowired
    private MovieRepository repository;

    @Autowired
    private MovieMapper mapper;

    @Autowired
    private FileServiceInterface fileService;

//    @Value("${movie.file.upload.directory}")
    private final String uploadDirectory = "src/main/resources/static/images/movies";

    @Override
    public Movie getMovieById(Long id) {
	return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Movie Not Found"));
    }

    @Override
    public MovieRespDto getMovieDetail(Long id) {
	MovieRespDto respDto = mapper.entityToDto(getMovieById(id));

	// Set image paths in the response DTO
	respDto.setPicturePaths(fileService.getImagePaths(respDto.getId(), uploadDirectory, MediaType.MOVIE));

	return respDto;
    }

    @Override
    public List<MovieRespDto> getAllMovies(Integer page, Integer size) {

	page = page > 0 ? page - 1 : 0;
	size = size < 3 ? 3 : size;
	Pageable pageable = PageRequest.of(page, size);
	List<Movie> movies = repository.findAll(pageable).getContent();
	List<MovieRespDto> respDto = mapper.entitiesToDto(movies);

	return respDto.stream().map(d -> {
	    d.setPicturePaths(fileService.getImagePaths(d.getId(), uploadDirectory, MediaType.MOVIE));
	    return d;
	}).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MovieRespDto createMovie(MovieReqDto dto) throws IOException {
	// Validate input
	if (dto == null || dto.getImageFiles() == null) {
	    throw new IllegalArgumentException("Movie data or image files cannot be null");
	}

	// Map DTO to entity
	Movie movie = mapper.DtoToEntity(dto);

	// Save the movie entity
	Movie savedMovie = repository.save(movie);

	// Save associated image files
	fileService.saveFiles(dto.getImageFiles(), savedMovie.getId(), MediaType.MOVIE, uploadDirectory);

	// Map the saved entity back to DTO
	MovieRespDto respDto = mapper.entityToDto(savedMovie);

	// Set image paths in the response DTO
	respDto.setPicturePaths(fileService.getImagePaths(savedMovie.getId(), uploadDirectory, MediaType.MOVIE));

	return respDto;
    }

    @Override
    public MovieRespDto updateMovie(Long id, MovieReqDto dto) {
	Movie existingMovie = getMovieById(id);

	existingMovie.setName(dto.getName());
	existingMovie.setDescription(dto.getDescription());
	existingMovie.setGenre(dto.getGenre());
	existingMovie.setReleaseDate(dto.getReleaseDate());
	existingMovie.setDuration(dto.getDuration());
	existingMovie.setActors(dto.getActors());
	return mapper.entityToDto(repository.save(existingMovie));
    }

    @Override
    public GlobalResp deleteMovie(Long id) {
	Movie existingMovie = getMovieById(id);

	fileService.deleteAllImages(id, MediaType.MOVIE);

	repository.delete(existingMovie);
	return GlobalResp.builder().message("Movie deleted succussfully").build();
    }
}
