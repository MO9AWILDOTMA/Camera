package ma.cinecamera.validation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import ma.cinecamera.model.Reservation;
import ma.cinecamera.model.enums.ReservationStatus;
import ma.cinecamera.repository.ReservationRepository;
import ma.cinecamera.service.IUserService;

@Component
public class ReservationValidator {

    @Autowired
    private ReservationRepository repository;

    @Autowired
    private IUserService userService;

    public Boolean checkIfThereIsReservationPending(Long userId) {

	return repository.findByUserIdAndStatus(userId, ReservationStatus.IN_PROGRESS).isPresent();
    }

    public Boolean checkIfUserAuthorizedOfCancelingReservation(Reservation reservation) {
	if (!reservation.getStatus().equals(ReservationStatus.IN_PROGRESS)) {
	    return false;
	} else if (userService.getConnectedUserId().equals(reservation.getUser().getId())) {
	    return false;
	}
	return true;
    }

}
