package ma.cinecamera.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

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
	@Column(name = "username", nullable = false, unique = true)
	@NotBlank(message = "Username is required")
	@NotNull(message = "Username is required")
	private String username;

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
}
