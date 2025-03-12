package ma.cinecamera.validation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import ma.cinecamera.model.Payment;
import ma.cinecamera.model.enums.PaymentStatus;
import ma.cinecamera.repository.PaymentRepository;
import ma.cinecamera.service.IUserService;

@Component
public class PaymentValidator {

    @Autowired
    private PaymentRepository repository;

    @Autowired
    private IUserService userService;

    public Boolean checkIfThereIsPaymentPending(Long userId) {

	return repository.findByUserId(userId).isPresent();
    }

    public boolean checkIfUserAuthorizedOfCancelingPayment(Payment payment) {
	if (!payment.getStatus().equals(PaymentStatus.IN_PROGRESS)) {
	    return false;
	} else if (userService.getConnectedUserId().equals(payment.getUser().getId())) {
	    return false;
	}
	return true;
    }

}
