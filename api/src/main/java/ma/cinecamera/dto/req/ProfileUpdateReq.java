package ma.cinecamera.dto.req;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class ProfileUpdateReq {
    @NotBlank(message = "First Name is required")
    @NotNull(message = "First Name is required")
    private String firstName;

    private String lastName;

    private String phone;

    @NotBlank(message = "Email is required")
    @NotNull(message = "Email is required")
    private String email;

    private String password;

    private Boolean enable;

    private MultipartFile imageFile;
}
