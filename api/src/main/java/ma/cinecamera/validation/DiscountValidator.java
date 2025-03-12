package ma.cinecamera.validation;

import org.springframework.stereotype.Component;

@Component
public class DiscountValidator {

    public Boolean checkDiscountPercentage(Double percentage) {
	if (percentage > 1 || percentage <= 0) {
	    return true;
	}

	return false;
    }
}
