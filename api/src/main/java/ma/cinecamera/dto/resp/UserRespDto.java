package ma.cinecamera.dto.resp;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import ma.cinecamera.model.Reservation;
import ma.cinecamera.model.Role;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UserRespDto extends BaseDto {

    private String firstName;

    private String lastName;

    private String phone;

    private String email;

    private String picture;

    private List<Reservation> reservations;

    private List<Role> roles;

    private Boolean enable;
}
