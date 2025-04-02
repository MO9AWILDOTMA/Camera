package ma.cinecamera.dto.req;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.cinecamera.model.Reservation;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentReqDto {
    @NotNull(message = "Payment Amount is required")
    private Double amount;

    @NotNull(message = "Reservation id is required")
    private Reservation reservation;

    @NotNull(message = "User id is required")
    private Long userId;

    @NotNull(message = "Payment currency is required")
    private String currency;

}
