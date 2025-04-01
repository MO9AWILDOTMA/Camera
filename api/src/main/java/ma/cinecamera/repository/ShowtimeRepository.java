package ma.cinecamera.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ma.cinecamera.model.Showtime;
import ma.cinecamera.model.enums.ReservationStatus;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    Optional<Showtime> findBySlug(String slug);

    Optional<Showtime> findByDateTimeAndScreeningRoomId(LocalDateTime dateTime, Long screeningRoomId);

    @Query("SELECT AVG(r.seats.size / s.totalSeats) " + "FROM Showtime s " + "JOIN s.reservations r "
	    + "WHERE r.status = :status AND s.dateTime BETWEEN :start AND :end")
    Optional<Double> averageOccupancy(@Param("status") ReservationStatus status, @Param("start") LocalDateTime start,
	    @Param("end") LocalDateTime end);

    List<Showtime> findByMovieId(Long id);
}
