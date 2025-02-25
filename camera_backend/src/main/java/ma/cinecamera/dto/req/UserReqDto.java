package ma.cinecamera.dto.req;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class UserReqDto {
    @NotBlank(message = "First Name is required")
    @NotNull(message = "First Name is required")
    private String firstName;

    @NotBlank(message = "Last Name is required")
    @NotNull(message = "Last Name is required")
    private String lastName;

    @NotBlank(message = "Phone is required")
    @NotNull(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Email is required")
    @NotNull(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @NotNull(message = "Password is required")
    private String password;

    private MultipartFile imageFile;
}
