package ma.cinecamera.service;

import java.util.List;

import ma.cinecamera.dto.resp.SeatChecker;
import ma.cinecamera.model.ScreeningRoom;
import ma.cinecamera.model.Seat;
import ma.cinecamera.model.enums.SeatStatus;

public interface ISeatService {

    Seat getById(Long id);

    void createSeats(ScreeningRoom screen);

    SeatChecker checkAvaibality(Long id);

    void updateStatus(Long id, SeatStatus status);

    void deleteSeats(List<Seat> seats);
}
