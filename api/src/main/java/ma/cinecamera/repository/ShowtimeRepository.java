package ma.cinecamera.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.cinecamera.model.Showtime;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {

    Optional<Showtime> findByDateTimeAndScreeningRoomId(LocalDateTime dateTime, Long screeningRoomId);
}
