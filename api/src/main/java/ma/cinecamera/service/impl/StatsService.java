package ma.cinecamera.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.cinecamera.dto.resp.MostReservedMovies;
import ma.cinecamera.dto.resp.MovieRespDto;
import ma.cinecamera.dto.resp.PaymentStatsDto;
import ma.cinecamera.dto.resp.ReservationStatsDto;
import ma.cinecamera.mapper.MovieMapper;
import ma.cinecamera.mapper.PaymentMapper;
import ma.cinecamera.model.Movie;
import ma.cinecamera.model.Payment;
import ma.cinecamera.model.enums.PaymentStatus;
import ma.cinecamera.model.enums.ReservationStatus;
import ma.cinecamera.repository.PaymentRepository;
import ma.cinecamera.repository.ReservationRepository;
import ma.cinecamera.service.IStatsService;

@Service
public class StatsService implements IStatsService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private MovieMapper movieMapper;

    @Autowired
    private PaymentMapper paymentMapper;

    private final Logger logger = Logger.getLogger(StatsService.class.getName());;

    @Override
    public ReservationStatsDto getReservationStats() {
	Long confirmedReservation = reservationRepository.countByStatus(ReservationStatus.CONFIRMED);
	Long cancelledReservation = reservationRepository.countByStatus(ReservationStatus.CANCELLED);
	Long inProgressReservation = reservationRepository.countByStatus(ReservationStatus.IN_PROGRESS);
	Long archivedReservation = reservationRepository.countByStatus(ReservationStatus.ARCHIVED);

	return ReservationStatsDto.builder().confirmedReservation(confirmedReservation)
		.cancelledReservation(cancelledReservation).inProgressReservation(inProgressReservation)
		.archivedReservation(archivedReservation).build();
    }

    @Override
    public List<MostReservedMovies> getShowtimeStats() {
	List<Object[]> results = reservationRepository.findTop5MostReservedMovies();
	List<MostReservedMovies> moviesList = new ArrayList<MostReservedMovies>();
	results.stream().map(result -> {
	    if (result == null || result[0] == null || result[1] == null) {
		return null;
	    }
	    Movie movie = (Movie) result[0];
	    Long count = ((Number) result[1]).longValue();
	    MovieRespDto dto = movieMapper.entityToDto(movie);

	    moviesList.add(MostReservedMovies.builder().movie(dto).reservationCount(count).build());
	    return result;
	}).collect(Collectors.toList());

	return moviesList;
    }

    @Override
    public List<PaymentStatsDto> getRevenues() {
	List<Payment> payments = paymentRepository.findByStatus(PaymentStatus.CONFIRMED);
	List<PaymentStatsDto> dtos = new ArrayList<PaymentStatsDto>();

	payments.forEach(p -> {
	    dtos.add(PaymentStatsDto.builder().payment(paymentMapper.entityToDto(p)).amount(p.getAmount())
		    .dateTime(p.getCreatedAt()).build());
	});
	return dtos;
    }
}
