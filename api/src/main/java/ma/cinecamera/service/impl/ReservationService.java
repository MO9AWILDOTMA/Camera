package ma.cinecamera.service.impl;

import java.util.List;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import ma.cinecamera.dto.req.ReservationReqDto;
import ma.cinecamera.dto.req.ReservationUpdateDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.dto.resp.ReservationRespDto;
import ma.cinecamera.exception.ResourceNotFoundException;
import ma.cinecamera.exception.ResourceValidationException;
import ma.cinecamera.mapper.ReservationMapper;
import ma.cinecamera.model.Reservation;
import ma.cinecamera.model.Showtime;
import ma.cinecamera.model.User;
import ma.cinecamera.model.enums.ReservationStatus;
import ma.cinecamera.repository.ReservationRepository;
import ma.cinecamera.service.IReservationService;
import ma.cinecamera.service.IShowtimeService;
import ma.cinecamera.service.IUserService;
import ma.cinecamera.validation.ReservationValidator;

@Service
public class ReservationService implements IReservationService {

    @Autowired
    private ReservationRepository repository;

    @Autowired
    private IUserService userService;

    @Autowired
    private IShowtimeService showtimeService;

    @Autowired
    private ReservationMapper mapper;

    @Autowired
    private ReservationValidator validator;

    private final Logger logger = Logger.getLogger(ReservationService.class.getName());

    @Override
    public Reservation getById(Long id) {
	return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Reservation Not Found"));
    }

    @Override
    public List<ReservationRespDto> getAll(Integer page, Integer size) {
	page = page > 0 ? page - 1 : 0;
	size = size < 3 ? 3 : size;
	Pageable pageable = PageRequest.of(page, size);
	List<Reservation> reservations = repository.findAll(pageable).getContent();
	List<ReservationRespDto> respDto = mapper.entitiesToDto(reservations);
	return respDto;
    }

    @Override
    public ReservationRespDto create(ReservationReqDto dto) {
	Long userId = dto.getUserId();
	User user = userService.getById(userId);
	Showtime showtime = showtimeService.getById(dto.getShowtimeId());

	if (!validator.checkIfThereIsReservationPending(userId)) {
	    throw new ResourceValidationException("Cannot create two Reservations in the same time");
	}

	Reservation reservation = mapper.DtoToEntity(dto);

	reservation.setUser(user);
	reservation.setShowtime(showtime);
	reservation.setStatus(ReservationStatus.IN_PROGRESS);

	Reservation savedReservation = repository.save(reservation);
	return mapper.entityToDto(savedReservation);
    }

    @Override
    public ReservationRespDto update(Long id, ReservationUpdateDto dto) {
	Reservation reservation = getById(id);
	Long userId = dto.getUserId();
	User user = userService.getById(userId);
	Showtime showtime = showtimeService.getById(dto.getShowtimeId());

	if (!userId.equals(reservation.getUser().getId())) {
	    if (!validator.checkIfThereIsReservationPending(userId)) {
		throw new ResourceValidationException("Cannot create two Reservations in the same time");
	    }
	    reservation.setUser(user);
	}

	reservation.setShowtime(showtime);
	reservation.setStatus(dto.getStatus());

	Reservation updatedReservation = repository.save(reservation);
	return mapper.entityToDto(updatedReservation);
    }

    @Override
    public GlobalResp delete(Long id) {
	Reservation reservation = getById(id);

	repository.delete(reservation);
	return GlobalResp.builder().message("Reservation deleted successfully").build();
    }

    @Override
    public GlobalResp cancelReservation(Long id) {
	Reservation reservation = getById(id);
	if (!validator.checkIfUserAuthorizedOfCancelingReservation(reservation)) {
	    throw new ResourceValidationException("Cannot cancel this Reservation User not authorized");
	}
	reservation.setStatus(ReservationStatus.CANCELLED);
	repository.save(reservation);
	return GlobalResp.builder().message("Reservation cancelled successfully").build();
    }

    @Override
    public GlobalResp archive(Long id) {
	Reservation reservation = getById(id);
	reservation.setStatus(ReservationStatus.CANCELLED);
	repository.save(reservation);
	return GlobalResp.builder().message("Reservation archived successfully").build();
    }
}
