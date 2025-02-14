package ma.cinecamera.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import ma.cinecamera.dto.req.MovieReqDto;
import ma.cinecamera.dto.resp.DeleteResp;
import ma.cinecamera.dto.resp.MovieRespDto;
import ma.cinecamera.exception.ResourceNotFoundException;
import ma.cinecamera.mapper.MovieMapper;
import ma.cinecamera.model.Media;
import ma.cinecamera.model.Movie;
import ma.cinecamera.model.enums.MediaType;
import ma.cinecamera.repository.MediaRepository;
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

    @Autowired
    private MediaRepository mediaRepository;

//    @Value("${movie.file.upload.directory}")
    private final String uploadDirectory = "src/main/resources/static/images/movies";

    @Override
    public Movie getMovieById(Long id) {
	return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Movie Not Found"));
    }

    @Override
    public MovieRespDto getMovieDetail(Long id) {
	return mapper.entityToDto(getMovieById(id));
    }

    @Override
    public List<MovieRespDto> getAllMovies(Integer page, Integer size) {

	page = page > 0 ? page - 1 : 0;
	size = size < 3 ? 3 : size;
	Pageable pageable = PageRequest.of(page, size);
	List<Movie> movies = repository.findAll(pageable).getContent();
	return mapper.entitiesToDto(movies);
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
	saveFiles(dto.getImageFiles(), savedMovie.getId());

	// Map the saved entity back to DTO
	MovieRespDto respDto = mapper.entityToDto(savedMovie);

	// Set image paths in the response DTO
	respDto.setPicturePaths(getImagePaths(savedMovie.getId()));

	return respDto;
    }

    private List<String> getImagePaths(Long ownerId) {
	return mediaRepository.findByMediaTypeAndOwnerId(MediaType.MOVIE, ownerId).stream()
		.map(media -> uploadDirectory + "/" + media.getName()).collect(Collectors.toList());
    }

    private void saveFiles(MultipartFile[] files, Long ownerId) throws IOException {

	// Ensure the upload directory exists
	Path uploadPath = Path.of(uploadDirectory);
	if (!Files.exists(uploadPath)) {
	    Files.createDirectories(uploadPath);
	}

	// Process each file
	for (MultipartFile file : files) {
	    if (file == null || file.isEmpty()) {
		continue; // Skip empty files
	    }

	    // Save the file to storage and get the unique file name
	    String uniqueFileName = fileService.saveImageToStorage(uploadDirectory, file);

	    // Create and save the Media entity
	    Media media = Media.builder().name(uniqueFileName).directory(uploadDirectory).mediaType(MediaType.MOVIE)
		    .ownerId(ownerId).build();
	    mediaRepository.save(media);
	}
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
    public DeleteResp deleteMovie(Long id) {
	Movie existingMovie = getMovieById(id);

	repository.delete(existingMovie);
	return DeleteResp.builder().message("Movie deleted succussfully").build();
    }
}
