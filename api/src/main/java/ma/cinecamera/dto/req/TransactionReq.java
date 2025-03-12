package ma.cinecamera.dto.req;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TransactionReq {
    private Double amount;
    private String currency;
    private Long orderId;
    private TransactionUserDto customer;
}
