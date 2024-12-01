package ma.cinecamera.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.cinecamera.model.enums.ReservationStatus;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "reservations")
public class Reservation extends BaseEntity {

	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "showtime_id", nullable = false)
	private Showtime showtime;

	@JsonManagedReference
	@OneToOne(mappedBy = "reservation", cascade = CascadeType.ALL)
	private Payment payment;

	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "cinephile_id", nullable = false)
	private Cinephile cinephile;

	@Column(name = "status", nullable = false)
	@NotNull(message = "Reservation Status is required")
	private ReservationStatus status;
}
