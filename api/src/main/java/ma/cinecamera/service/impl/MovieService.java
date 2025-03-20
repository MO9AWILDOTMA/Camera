package ma.cinecamera.service.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.github.slugify.Slugify;

import lombok.AllArgsConstructor;
import ma.cinecamera.dto.req.MovieReqDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ListResponse;
import ma.cinecamera.dto.resp.MovieRespDto;
import ma.cinecamera.exception.ResourceNotFoundException;
import ma.cinecamera.mapper.MovieMapper;
import ma.cinecamera.model.Movie;
import ma.cinecamera.model.enums.Genre;
import ma.cinecamera.model.enums.MediaType;
import ma.cinecamera.model.enums.MovieStatus;
import ma.cinecamera.repository.MovieRepository;
import ma.cinecamera.service.IFileService;
import ma.cinecamera.service.IMovieService;

@Service
@AllArgsConstructor
public class MovieService implements IMovieService {

    @Autowired
    private MovieRepository repository;

    @Autowired
    private MovieMapper mapper;

    @Autowired
    private IFileService fileService;

//    @Value("${movie.file.upload.directory}")
    private final String uploadDirectory = "src/main/resources/static/images/movies";

    @SuppressWarnings("unused")
    private final Logger logger = Logger.getLogger(MovieService.class.getName());

    private final Slugify slg = new Slugify();

    @Override
    public Movie getMovieById(Long id) {
	return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Movie Not Found"));
    }

    @Override
    public MovieRespDto getMovieDetail(String slug) {
	Movie movie = repository.findBySlug(slug).orElseThrow(() -> new ResourceNotFoundException("Movie Not Found"));
	MovieRespDto respDto = mapper.entityToDto(movie);

	// Set image paths in the response DTO
	respDto.setPicturePaths(fileService.getFilePaths(respDto.getId(), uploadDirectory, MediaType.MOVIE));

	return respDto;
    }

    @Override
    public ListResponse getAllMovies(Integer page, Integer size) {
	page = page > 0 ? page - 1 : 0;
	size = size < 3 ? 3 : size;
	Pageable pageable = PageRequest.of(page, size);

	Page<Movie> res = repository.findAll(pageable);
	List<Movie> movies = res.getContent();
	Long totalElements = res.getTotalElements();
	Integer totalPages = res.getTotalPages();

	List<MovieRespDto> respDto = mapper.entitiesToDto(movies).stream().map(d -> {
	    d.setPicturePaths(fileService.getFilePaths(d.getId(), uploadDirectory, MediaType.MOVIE));
	    return d;
	}).collect(Collectors.toList());

	return ListResponse.builder().content(respDto).totalElements(totalElements).totalPages(totalPages).build();

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

	movie.setStatus(MovieStatus.COMING_SOON);
	movie.setSlug(slg.slugify(movie.getName()));

	// Save the movie entity
	Movie savedMovie = repository.save(movie);

	String uniqueUploadDir = uploadDirectory + "/" + savedMovie.getId();

	// Save associated image files
	fileService.saveFiles(dto.getImageFiles(), savedMovie.getId(), MediaType.MOVIE, uniqueUploadDir);

	// Map the saved entity back to DTO
	MovieRespDto respDto = mapper.entityToDto(savedMovie);

	// Set image paths in the response DTO
	respDto.setPicturePaths(fileService.getFilePaths(savedMovie.getId(), uniqueUploadDir, MediaType.MOVIE));

	return respDto;
    }

    @Override
    @Transactional
    public MovieRespDto updateMovie(Long id, MovieReqDto dto) throws IOException {
	// Validate input
	if (dto == null) {
	    throw new IllegalArgumentException("Movie data cannot be null");
	}
	Movie existingMovie = getMovieById(id);

	String name = dto.getName();
	existingMovie.setName(name);
	existingMovie.setSlug(slg.slugify(name));
	existingMovie.setDescription(dto.getDescription());
	existingMovie.setGenres(dto.getGenres());
	existingMovie.setReleaseDate(dto.getReleaseDate());
	existingMovie.setDuration(dto.getDuration());
	existingMovie.setActors(dto.getActors());
	existingMovie.setStatus(dto.getStatus());

	Movie updatedMovie = repository.save(existingMovie);

	String uniqueUploadDir = uploadDirectory + "/" + updatedMovie.getId();

	fileService.updateFiles(dto.getImageFiles(), updatedMovie.getId(), MediaType.MOVIE, uniqueUploadDir);

	MovieRespDto respDto = mapper.entityToDto(updatedMovie);

	// Set image paths in the response DTO
	respDto.setPicturePaths(fileService.getFilePaths(updatedMovie.getId(), uniqueUploadDir, MediaType.MOVIE));

	return respDto;
    }

    @Override
    public GlobalResp deleteMovie(Long id) {
	Movie existingMovie = getMovieById(id);

	fileService.deleteAllFiles(id, MediaType.MOVIE);

	repository.delete(existingMovie);
	return GlobalResp.builder().message("Movie deleted succussfully").id(id).createdAt(existingMovie.getCreatedAt())
		.updatedAt(existingMovie.getUpdatedAt()).build();
    }

    @Override
    public ListResponse search(String q, String genre, Integer page, Integer size) {
	page = page > 0 ? page - 1 : 0;
	size = size < 3 ? 3 : size;
	Pageable pageable = PageRequest.of(page, size);

	Page<Movie> res = repository.findByNameContainingIgnoreCase(q, pageable);
	List<Movie> movies = res.getContent();
	Long totalElements = res.getTotalElements();
	Integer totalPages = res.getTotalPages();

	Genre targetGenre = genre.equalsIgnoreCase("all") ? null : Genre.valueOf(genre.toUpperCase());
	List<MovieRespDto> respDto = mapper.entitiesToDto(movies).stream().map(d -> {
	    d.setPicturePaths(fileService.getFilePaths(d.getId(), uploadDirectory, MediaType.MOVIE));
	    return d;
	}).filter(m -> targetGenre == null || m.getGenres().contains(targetGenre)).collect(Collectors.toList());

	return ListResponse.builder().content(respDto).totalElements(totalElements).totalPages(totalPages).build();

    }

    @Override
    public List<MovieRespDto> currentAndUpcomingmovies(Integer page, Integer size) {
	page = page > 0 ? page - 1 : 0;
	size = size < 3 ? 3 : size;
	Pageable pageable = PageRequest.of(page, size);
	List<MovieRespDto> moviesDtos = mapper
		.entitiesToDto(repository.findMoviesWithUpcomingShowtimes(LocalDateTime.now(), pageable));

	return moviesDtos.stream().map(d -> {
	    d.setPicturePaths(fileService.getFilePaths(d.getId(), uploadDirectory, MediaType.MOVIE));
	    return d;
	}).collect(Collectors.toList());

    }
}
