package ma.cinecamera.dto.req;

import java.util.List;

import javax.validation.constraints.NotNull;

import lombok.Data;
import ma.cinecamera.model.enums.ERole;

@Data
public class RolesDto {
    @NotNull(message = "Email should not be null")
    List<ERole> roles;
}
