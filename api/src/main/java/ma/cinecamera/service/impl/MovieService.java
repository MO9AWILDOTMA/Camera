package ma.cinecamera.service.impl;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.multipart.MultipartFile;

import com.github.slugify.Slugify;

import lombok.AllArgsConstructor;
import ma.cinecamera.dto.req.MovieReqDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ListResponse;
import ma.cinecamera.dto.resp.MovieRespDto;
import ma.cinecamera.exception.ResourceNotFoundException;
import ma.cinecamera.mapper.MovieMapper;
import ma.cinecamera.model.Media;
import ma.cinecamera.model.Movie;
import ma.cinecamera.model.enums.ActivityType;
import ma.cinecamera.model.enums.Genre;
import ma.cinecamera.model.enums.MediaCategory;
import ma.cinecamera.model.enums.MediaType;
import ma.cinecamera.model.enums.MovieStatus;
import ma.cinecamera.repository.MediaRepository;
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
    private final String IMAGES_UPLOAD_DIR = "uploads/images/movies";

    private static final String TRAILER_UPLOAD_DIR = "uploads/trailers/";

    @SuppressWarnings("unused")
    private final Logger logger = Logger.getLogger(MovieService.class.getName());

    private final Slugify slg = new Slugify();

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private ActivityService activityService;

    @Override
    public Movie getMovieById(Long id) {
	return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Movie Not Found"));
    }

    @Override
    public MovieRespDto getMovieDetail(String slug) {
	Movie movie = repository.findBySlug(slug).orElseThrow(() -> new ResourceNotFoundException("Movie Not Found"));
	MovieRespDto respDto = mapper.entityToDto(movie);

	// Set image paths in the response DTO
	respDto.setPicturePaths(fileService.getFilePaths(respDto.getId(), IMAGES_UPLOAD_DIR, MediaType.MOVIE));

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
	    d.setPicturePaths(fileService.getFilePaths(d.getId(), IMAGES_UPLOAD_DIR, MediaType.MOVIE));
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

	String uniqueUploadDir = IMAGES_UPLOAD_DIR + "/" + savedMovie.getId();

	// Save associated image files
	fileService.saveFiles(dto.getImageFiles(), savedMovie.getId(), MediaType.MOVIE, MediaCategory.IMAGE,
		uniqueUploadDir);

	// Map the saved entity back to DTO
	MovieRespDto respDto = mapper.entityToDto(savedMovie);

	// Set image paths in the response DTO
	respDto.setPicturePaths(fileService.getFilePaths(savedMovie.getId(), uniqueUploadDir, MediaType.MOVIE));

	activityService.createActivity(ActivityType.MOVIE, movie.getName());

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

	String uniqueUploadDir = IMAGES_UPLOAD_DIR + "/" + updatedMovie.getId();

	fileService.updateFiles(dto.getImageFiles(), updatedMovie.getId(), MediaType.MOVIE, MediaCategory.IMAGE,
		uniqueUploadDir);

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
	    d.setPicturePaths(fileService.getFilePaths(d.getId(), IMAGES_UPLOAD_DIR, MediaType.MOVIE));
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
	    d.setPicturePaths(fileService.getFilePaths(d.getId(), IMAGES_UPLOAD_DIR, MediaType.MOVIE));
	    return d;
	}).collect(Collectors.toList());

    }

    @Override
    public ResponseEntity<GlobalResp> uploadMovieTrailer(MultipartFile file, Long movieId) {
	if (file == null || file.isEmpty()) {
	    return ResponseEntity.badRequest().body(new GlobalResp("File is empty", false));
	}

	try {
	    String uploadDirectory = "uploads/trailers/" + movieId;
	    fileService.saveFiles(new MultipartFile[] { file }, movieId, MediaType.MOVIE, MediaCategory.VIDEO,
		    uploadDirectory);
	    return ResponseEntity.ok(new GlobalResp("Trailer uploaded successfully", true));
	} catch (IOException e) {
	    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
		    .body(new GlobalResp("File upload failed", false));
	}
    }

    @Override
    @GetMapping("/streamTrailer/{movieId}")
    public ResponseEntity<ResourceRegion> streamMovieTrailer(Long movieId, HttpHeaders headers) {
	Optional<Media> mediaOptional = mediaRepository
		.findByMediaTypeAndOwnerIdAndMediaCategory(MediaType.MOVIE, movieId, MediaCategory.VIDEO).stream()
		.findFirst();

	if (!mediaOptional.isPresent()) {
	    return ResponseEntity.notFound().build();
	}

	Media media = mediaOptional.get();
	Path filePath = Paths.get(media.getDirectory()).resolve(media.getName()).normalize();

	try {
	    UrlResource videoResource = new UrlResource(filePath.toUri());

	    if (!videoResource.exists()) {
		return ResponseEntity.notFound().build();
	    }

	    // Get file size
	    long contentLength = videoResource.contentLength();
	    ResourceRegion region;

	    // Check if the request includes a "Range" header
	    if (headers.getRange().isEmpty()) {
		// If no range, send the full file
		region = new ResourceRegion(videoResource, 0, contentLength);
	    } else {
		// Handle partial content requests
		HttpRange range = headers.getRange().get(0);
		long rangeStart = range.getRangeStart(contentLength);
		long rangeEnd = Math.min(rangeStart + (1024 * 1024), contentLength - 1); // 1MB chunks
		region = new ResourceRegion(videoResource, rangeStart, rangeEnd - rangeStart + 1);
	    }

	    return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
		    .contentType(MediaTypeFactory.getMediaType(videoResource)
			    .orElse(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM))
		    .header(HttpHeaders.ACCEPT_RANGES, "bytes").body(region);

	} catch (IOException e) {
	    return ResponseEntity.internalServerError().build();
	}
    }

}
