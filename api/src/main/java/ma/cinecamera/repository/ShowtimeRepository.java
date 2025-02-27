package ma.cinecamera.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.cinecamera.model.ScreeningRoom;
import ma.cinecamera.model.Showtime;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {

    public List<Showtime> findByDateTimeAndScreeningRoom(LocalDateTime dateTime, ScreeningRoom screeningRoom);
}
