package ma.cinecamera.service.impl;

import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.slugify.Slugify;

import ma.cinecamera.dto.req.ShowtimeReqDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ListResponse;
import ma.cinecamera.dto.resp.ShowtimeRespDto;
import ma.cinecamera.exception.ResourceNotFoundException;
import ma.cinecamera.exception.ResourceValidationException;
import ma.cinecamera.mapper.ShowtimeMapper;
import ma.cinecamera.model.Movie;
import ma.cinecamera.model.ScreeningRoom;
import ma.cinecamera.model.Showtime;
import ma.cinecamera.model.enums.MediaType;
import ma.cinecamera.repository.MovieRepository;
import ma.cinecamera.repository.ShowtimeRepository;
import ma.cinecamera.service.IDiscountService;
import ma.cinecamera.service.IFileService;
import ma.cinecamera.service.IMovieService;
import ma.cinecamera.service.IScreeningRoomService;
import ma.cinecamera.service.IShowtimeService;
import ma.cinecamera.validation.ShowtimeValidator;

@Service
public class ShowtimeService implements IShowtimeService {

    @Autowired
    private ShowtimeRepository repository;

    @Autowired
    private IMovieService movieService;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private IScreeningRoomService screeningRoomService;

    @Autowired
    private IDiscountService discountService;

    @Autowired
    private ShowtimeMapper mapper;

    @Autowired
    private ShowtimeValidator validator;

    private final Logger logger = Logger.getLogger(ShowtimeService.class.getName());

    @Autowired
    private IFileService fileService;

//    @Value("${movie.file.upload.directory}")
    private final String uploadDirectory = "src/main/resources/static/images/movies";

    private final Slugify slg = new Slugify();

    @Override
    public Showtime getById(Long id) {
	return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Showtime Not Found"));
    }

    @Override
    public ListResponse getAllShowtimes(Integer page, Integer size) {
	page = page > 0 ? page - 1 : 0;
	size = size < 3 ? 3 : size;
	Pageable pageable = PageRequest.of(page, size);
	Page<Showtime> res = repository.findAll(pageable);
	List<Showtime> showtimes = res.getContent();
	Long totalElements = res.getTotalElements();
	Integer totalPages = res.getTotalPages();
	List<ShowtimeRespDto> dtos = mapper.entitiesToDto(showtimes).stream().map(d -> {
	    d.getMovie().setPicturePaths(fileService.getFilePaths(d.getId(), uploadDirectory, MediaType.MOVIE));
	    return d;
	}).collect(Collectors.toList());
	return ListResponse.builder().content(dtos).totalElements(totalElements).totalPages(totalPages).build();
    }

    @Override
    public ShowtimeRespDto getShowtimeDetail(String slug) {
	Showtime showtime = repository.findBySlug(slug)
		.orElseThrow(() -> new ResourceNotFoundException("Showtime Not Found"));
	ShowtimeRespDto dto = mapper.entityToDto(showtime);
	dto.getMovie().setPicturePaths(fileService.getFilePaths(dto.getId(), uploadDirectory, MediaType.MOVIE));
	return dto;
    }

    @Override
    @Transactional
    public ShowtimeRespDto createShowtime(ShowtimeReqDto dto) {
	if (dto == null) {
	    throw new IllegalArgumentException("Movie data cannot be null");
	}

	Movie movie = movieService.getMovieById(dto.getMovieId());
	ScreeningRoom sRoom = screeningRoomService.getById(dto.getScreeningRoomId());
	Integer totalSeats = dto.getTotalSeats();

	if (validator.checkDateAndScreeningRoomConflict(dto.getDateTime(), sRoom.getId())) {
	    throw new ResourceValidationException(
		    "Showtime creation failed, cannot be two showtimes in same time and same screening room.");
	}

	if (totalSeats > sRoom.getSeats()) {
	    throw new ResourceValidationException(
		    "Showtime creation failed, total seats greater than screening room seats which is: "
			    + sRoom.getSeats());
	}
	Showtime showtime = mapper.DtoToEntity(dto);
	String uniqueName = dto.getDateTime() + " " + movie.getName();
	String slug = slg.slugify(uniqueName);
	showtime.setSlug(slug);
	showtime.setMovie(movie);
	showtime.setScreeningRoom(sRoom);
	showtime.setDiscounts(discountService.getDiscounts(dto.getDiscountIds()));
	showtime.setTotalSeats(totalSeats);
	Showtime savedShowtime = repository.save(showtime);
	movie.updateStatus();
	movieRepository.save(movie);

	return mapper.entityToDto(savedShowtime);
    }

    @Override
    @Transactional
    public ShowtimeRespDto updateShowtime(Long id, ShowtimeReqDto dto) {
	Showtime showtime = getById(id);

	if (dto == null) {
	    throw new IllegalArgumentException("Movie data cannot be null");
	}

	Movie movie = movieService.getMovieById(dto.getMovieId());
	ScreeningRoom sRoom = screeningRoomService.getById(dto.getScreeningRoomId());

	Boolean dateChecker = dto.getDateTime().equals(showtime.getDateTime());
	Boolean sRoomChecker = dto.getScreeningRoomId().equals(showtime.getScreeningRoom().getId());

	if (!dateChecker || !sRoomChecker) {
	    if (validator.checkDateAndScreeningRoomConflict(dto.getDateTime(), sRoom.getId())) {
		throw new ResourceValidationException(
			"Showtime creation failed, cannot be two showtimes in same time and same screening room.");
	    }
	}
	showtime.setDiscounts(discountService.getDiscounts(dto.getDiscountIds()));
	showtime.setPrice(dto.getPrice());
	showtime.setDateTime(dto.getDateTime());
	showtime.setMovie(movie);
	showtime.setScreeningRoom(sRoom);
	showtime.setShowVersion(dto.getShowVersion());
	showtime.setSpecialEvent(dto.isSpecialEvent());
	showtime.setPreview(dto.isPreview());
	showtime.setTotalSeats(dto.getTotalSeats());
	String uniqueName = dto.getDateTime() + " " + movie.getName();
	String slug = slg.slugify(uniqueName);
	showtime.setSlug(slug);

	Showtime savedShowtime = repository.save(showtime);
	movie.updateStatus();
	movieRepository.save(movie);
	return mapper.entityToDto(savedShowtime);
    }

    @Override
    public GlobalResp deleteShowtime(Long id) {
	Showtime showtime = getById(id);
	Movie movie = showtime.getMovie();
	repository.delete(showtime);

	movie.updateStatus();
	movieRepository.save(movie);
	return GlobalResp.builder().id(id).message("Showtime deleted successfully").id(id)
		.createdAt(showtime.getCreatedAt()).updatedAt(showtime.getUpdatedAt()).build();
    }
}
