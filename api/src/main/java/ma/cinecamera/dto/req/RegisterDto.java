package ma.cinecamera.dto.req;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
public class RegisterDto {
    @NotBlank(message = "First Name is required")
    @NotNull(message = "First Name is required")
    private String firstName;

    private String lastName;

    private String phone;

    @NotBlank(message = "Email is required")
    @NotNull(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @NotNull(message = "Password is required")
    private String password;
}
