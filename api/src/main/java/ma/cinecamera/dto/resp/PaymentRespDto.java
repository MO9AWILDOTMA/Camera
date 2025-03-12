package ma.cinecamera.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import ma.cinecamera.model.enums.PaymentStatus;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
public class PaymentRespDto extends BaseDto {
    private Double amount;
    private ReservationRespDto reservation; // Use DTO instead of entity
    private UserRespDto user; // Use DTO instead of entity
    private PaymentStatus status;
    private TransactionResp transaction; // Use DTO instead of entity
}
