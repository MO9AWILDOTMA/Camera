package ma.cinecamera.validation;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import ma.cinecamera.model.ScreeningRoom;
import ma.cinecamera.model.Showtime;
import ma.cinecamera.repository.ShowtimeRepository;

@Component
public class ShowtimeValidator {

    @Autowired
    private ShowtimeRepository repository;

    public Boolean checkDateAndScreeningRoomConflict(LocalDateTime dateTime, ScreeningRoom sRoom) {

	List<Showtime> showtimes = repository.findByDateTimeAndScreeningRoom(dateTime, sRoom);

	if (showtimes.size() > 0) {
	    return false;
	} else {
	    return true;
	}
    }
}
