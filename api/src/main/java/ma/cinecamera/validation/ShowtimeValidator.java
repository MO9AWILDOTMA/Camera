package ma.cinecamera.validation;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import ma.cinecamera.repository.ShowtimeRepository;

@Component
public class ShowtimeValidator {

    @Autowired
    private ShowtimeRepository repository;

    public Boolean checkDateAndScreeningRoomConflict(LocalDateTime dateTime, Long sRoomId) {

	return repository.findByDateTimeAndScreeningRoomId(dateTime, sRoomId).isPresent();
    }

}
