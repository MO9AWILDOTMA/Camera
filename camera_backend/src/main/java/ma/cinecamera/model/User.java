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

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User extends BaseEntity {
	@Column(name = "email", nullable = false, unique = true)
	@NotBlank(message = "Email is required")
	@NotNull(message = "Email is required")
	private String email;

	@Column(name = "password", nullable = false)
	@NotBlank(message = "Password is required")
	@NotNull(message = "Password is required")
	private String password;

	@Column(name = "picture", nullable = false)
	@NotBlank(message = "Picture is required")
	@NotNull(message = "Picture is required")
	private String picture;

	@JsonManagedReference
	@OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<Role> roles;
}
