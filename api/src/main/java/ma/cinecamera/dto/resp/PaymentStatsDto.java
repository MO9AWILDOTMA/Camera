package ma.cinecamera.dto.resp;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class PaymentStatsDto {
    private PaymentRespDto payment;
    private Double amount;
    private LocalDateTime dateTime;
}
