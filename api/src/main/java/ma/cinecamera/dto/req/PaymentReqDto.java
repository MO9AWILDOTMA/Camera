package ma.cinecamera.dto.req;

import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
public class PaymentReqDto {
    @NotNull(message = "Payment Amount is required")
    private Double amount;

    @NotNull(message = "Reservation id is required")
    private Long reservationId;

    @NotNull(message = "User id is required")
    private Long userId;

    @NotNull(message = "Payment currency is required")
    private String currency;

}
