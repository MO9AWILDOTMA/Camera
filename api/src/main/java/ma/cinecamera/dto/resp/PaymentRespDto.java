package ma.cinecamera.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import ma.cinecamera.model.Reservation;
import ma.cinecamera.model.User;
import ma.cinecamera.model.enums.PaymentStatus;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PaymentRespDto extends BaseDto {
    private Double amount;

    private Reservation reservation;

    private User user;

    private PaymentStatus status;
}
