package ma.cinecamera.model;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@Entity
@Table(name = "showtimes")
public class Showtime extends BaseEntity {

	@Column(name = "date_time", nullable = false)
	@NotNull(message = "Showtime Date and Time is required")
	private LocalDateTime dateTime;

	@Column(name = "price", nullable = false)
	@NotNull(message = "Showtime Price is required")
	private Double price;

	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "movie_id", nullable = false)
	private Movie movie;

	@JsonManagedReference
	@ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinTable(name = "showtime_discounts", joinColumns = @JoinColumn(name = "showtime_id"), inverseJoinColumns = @JoinColumn(name = "discount_id"))
	private List<Discount> discounts;

	@JsonManagedReference
	@OneToMany(mappedBy = "showtime", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Reservation> reservations;

	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "screening_room_id", nullable = false)
	private ScreeningRoom screeningRoom;

}
