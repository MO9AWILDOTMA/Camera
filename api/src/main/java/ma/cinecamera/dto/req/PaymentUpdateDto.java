package ma.cinecamera.dto.req;

import javax.validation.constraints.NotNull;

import lombok.Data;
import ma.cinecamera.model.enums.PaymentStatus;

@Data
public class PaymentUpdateDto {
    @NotNull(message = "Payment Amount is required")
    private Double amount;

    @NotNull(message = "Reservation id is required")
    private Long reservationId;

    @NotNull(message = "User id is required")
    private Long userId;

    private PaymentStatus status;
}
