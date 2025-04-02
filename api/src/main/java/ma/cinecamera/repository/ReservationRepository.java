package ma.cinecamera.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ma.cinecamera.model.Reservation;
import ma.cinecamera.model.enums.ReservationStatus;
import ma.cinecamera.utils.DateValue;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Optional<Reservation> findByUserIdAndStatus(Long UserId, ReservationStatus status);

    List<Reservation> findByUserId(Long UserId);

    Long countByStatusAndCreatedAtBetween(ReservationStatus status, LocalDateTime start, LocalDateTime end);

    List<Reservation> findByStatusAndShowtimeDateTimeBetween(ReservationStatus status, LocalDateTime start,
	    LocalDateTime end);

    @Query("SELECT CAST(r.createdAt AS date) as date, COUNT(r) as value " + "FROM Reservation r "
	    + "WHERE r.status = :status AND r.createdAt BETWEEN :start AND :end "
	    + "GROUP BY CAST(r.createdAt AS date) " + "ORDER BY date")
    List<DateValue> findDailySales(@Param("status") ReservationStatus status, @Param("start") LocalDateTime start,
	    @Param("end") LocalDateTime end);

    @Query("SELECT m, COUNT(r) as tickets, SUM(p.amount) as revenue " + "FROM Reservation r " + "JOIN r.showtime s "
	    + "JOIN s.movie m " + "JOIN r.payment p " + "WHERE r.status = :status " + "GROUP BY m "
	    + "ORDER BY tickets DESC")
    List<Object[]> findTop5MostReservedMoviesWithRevenue(@Param("status") ReservationStatus status);
}
