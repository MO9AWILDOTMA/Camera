package ma.cinecamera.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.cinecamera.model.enums.TransactionStatus;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "transactions")
public class Transaction extends BaseEntity {
    @Column(name = "amount", nullable = false)
    @NotNull(message = "Transaction amount is required")
    private Double amount;
    @Column(name = "currency", nullable = false)
    @NotNull(message = "Transaction currency is required")
    private String currency;
    @Column(name = "order_id", nullable = false)
    @NotNull(message = "Transaction order id is required")
    private Long orderId;
    @Column(name = "token", nullable = false)
    @NotNull(message = "Transaction token is required")
    private String token;
    @Column(name = "status", nullable = false)
    @NotNull(message = "Transaction status is required")
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;
}
