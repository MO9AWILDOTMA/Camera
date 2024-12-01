package ma.cinecamera.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@Entity
@Table(name = "discounts")
public class Discount extends BaseEntity {
	@Column(name = "name", nullable = false, unique = true)
	@NotBlank(message = "Discount Name is required")
	@NotNull(message = "Discount Name is required")
	private String name;

	@Column(name = "percentage", nullable = false)
	@NotNull(message = "Discount Percentage is required")
	private Double percetage;

	@JsonBackReference
	@ManyToMany(mappedBy = "discounts", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Showtime> showtimes;

}
