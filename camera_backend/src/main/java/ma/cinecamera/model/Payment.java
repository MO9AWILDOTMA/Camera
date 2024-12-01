package ma.cinecamera.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@Entity
@Table(name = "payments")
public class Payment extends BaseEntity {
	@Column(name = "amount", nullable = false)
	@NotNull(message = "Payment Amount is required")
	private Double amount;

	@OneToOne
	@JoinColumn(name = "reservation_id", nullable = false, unique = true)
	private Reservation reservation;
}
