package ma.cinecamera.service;

import java.util.List;

import ma.cinecamera.dto.resp.MostReservedMovies;
import ma.cinecamera.dto.resp.PaymentStatsDto;
import ma.cinecamera.dto.resp.ReservationStatsDto;

public interface IStatsService {

    ReservationStatsDto getReservationStats();

    List<MostReservedMovies> getShowtimeStats();

    List<PaymentStatsDto> getRevenues();

}
