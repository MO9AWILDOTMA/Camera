package ma.cinecamera.dto.req;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
public class ScreeningRoomReqDto {
    @NotBlank(message = "Screening Room Name is required")
    @NotNull(message = "Screening Room Name is required")
    private String name;

    @NotNull(message = "Screening Room Seats is required")
    @Min(value = 50, message = "Screening Room cannot be less than 50 seats")
    private Integer seats;
}
