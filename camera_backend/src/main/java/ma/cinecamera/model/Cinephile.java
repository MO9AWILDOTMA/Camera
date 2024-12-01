package ma.cinecamera.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "cinephiles")
public class Cinephile extends User {

	@Column(name = "first_name", nullable = false)
	@NotBlank(message = "First Name is required")
	@NotNull(message = "First Name is required")
	private String firstName;

	@Column(name = "last_name", nullable = false)
	@NotBlank(message = "Last Name is required")
	@NotNull(message = "Last Name is required")
	private String lastName;

	@Column(name = "phone", nullable = false)
	@NotBlank(message = "Phone is required")
	@NotNull(message = "Phone is required")
	private String phone;

	@JsonManagedReference
	@OneToMany(mappedBy = "cinephile", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Reservation> reservations;
}
