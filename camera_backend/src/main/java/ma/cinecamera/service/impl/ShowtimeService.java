package ma.cinecamera.service.impl;

import java.util.List;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import ma.cinecamera.dto.req.ShowtimeReqDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ShowtimeRespDto;
import ma.cinecamera.exception.ResourceNotFoundException;
import ma.cinecamera.exception.ResourceValidationException;
import ma.cinecamera.mapper.ShowtimeMapper;
import ma.cinecamera.model.Movie;
import ma.cinecamera.model.ScreeningRoom;
import ma.cinecamera.model.Showtime;
import ma.cinecamera.repository.ShowtimeRepository;
import ma.cinecamera.service.IMovieService;
import ma.cinecamera.service.IScreeningRoomService;
import ma.cinecamera.service.IShowtimeService;
import ma.cinecamera.validation.ShowtimeValidator;

public class ShowtimeService implements IShowtimeService {

    @Autowired
    private ShowtimeRepository repository;

    @Autowired
    private IMovieService movieService;

    @Autowired
    private IScreeningRoomService screeningRoomService;

    @Autowired
    private ShowtimeMapper mapper;

    @Autowired
    private ShowtimeValidator validator;

    private final Logger logger = Logger.getLogger(ShowtimeService.class.getName());

    @Override
    public Showtime getById(Long id) {
	return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Showtime Not Found"));
    }

    @Override
    public List<ShowtimeRespDto> getAllShowtimes(Integer page, Integer size) {
	page = page > 0 ? page - 1 : 0;
	size = size < 3 ? 3 : size;
	Pageable pageable = PageRequest.of(page, size);
	List<Showtime> showtimes = repository.findAll(pageable).getContent();

	return mapper.entitiesToDto(showtimes);
    }

    @Override
    public ShowtimeRespDto getShowtimeDetail(Long id) {
	return mapper.entityToDto(getById(id));
    }

    @Override
    @Transactional
    public ShowtimeRespDto createShowtime(ShowtimeReqDto dto) {
	if (dto == null) {
	    throw new IllegalArgumentException("Movie data cannot be null");
	}

	Movie movie = movieService.getMovieById(dto.getMovieId());
	ScreeningRoom sRoom = screeningRoomService.getById(dto.getScreeningRoomId());

	if (!validator.checkDateAndScreeningRoomConflict(dto.getDateTime(), sRoom)) {
	    throw new ResourceValidationException(
		    "Showtime creation failed, cannot be two showtimes in same time and same screening room.");
	}
	Showtime showtime = mapper.DtoToEntity(dto);

	showtime.setMovie(movie);
	showtime.setScreeningRoom(sRoom);

	Showtime savedShowtime = repository.save(showtime);

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
	    if (!validator.checkDateAndScreeningRoomConflict(dto.getDateTime(), sRoom)) {
		throw new ResourceValidationException(
			"Showtime creation failed, cannot be two showtimes in same time and same screening room.");
	    }
	}

	showtime.setPrice(dto.getPrice());
	showtime.setDateTime(dto.getDateTime());
	showtime.setMovie(movie);
	showtime.setScreeningRoom(sRoom);

	Showtime savedShowtime = repository.save(showtime);

	return mapper.entityToDto(savedShowtime);
    }

    @Override
    public GlobalResp deleteShowtime(Long id) {
	Showtime showtime = getById(id);

	repository.delete(showtime);

	return GlobalResp.builder().id(id).message("Showtime deleted successfully").build();
    }

}
