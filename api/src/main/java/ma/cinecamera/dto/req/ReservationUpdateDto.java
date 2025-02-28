package ma.cinecamera.dto.req;

import javax.validation.constraints.NotNull;

import lombok.Data;
import ma.cinecamera.model.enums.ReservationStatus;

@Data
public class ReservationUpdateDto {
    @NotNull(message = "Showtime id is required")
    private Long showtimeId;

    @NotNull(message = "User id is required")
    private Long userId;

    @NotNull(message = "Reservation status is required")
    private ReservationStatus status;
}
