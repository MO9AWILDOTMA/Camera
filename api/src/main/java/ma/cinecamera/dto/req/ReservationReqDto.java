package ma.cinecamera.dto.req;

import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
public class ReservationReqDto {
    @NotNull(message = "Showtime id is required")
    private Long showtimeId;

    @NotNull(message = "User id is required")
    private Long userId;

    @NotNull(message = "Reservation Seats is required")
    private String[] seats;
}
