package ma.cinecamera.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import ma.cinecamera.model.Reservation;
import ma.cinecamera.model.enums.ReservationStatus;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Optional<Reservation> findByUserIdAndStatus(Long UserId, ReservationStatus status);

    Long countByStatus(ReservationStatus status);

    @Query(value = "SELECT m, COUNT(r.id) AS reservation_count " + "FROM Reservation r " + "JOIN r.showtime s "
	    + "JOIN s.movie m " + "GROUP BY m " + "ORDER BY reservation_count DESC")
    List<Object[]> findTop5MostReservedMovies();
}
