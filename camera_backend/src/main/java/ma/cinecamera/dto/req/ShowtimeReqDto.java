package ma.cinecamera.dto.req;

import java.time.LocalDateTime;

import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
public class ShowtimeReqDto {
    @NotNull(message = "Showtime Date and Time is required")
    private LocalDateTime dateTime;

    @NotNull(message = "Showtime Price is required")
    private Double price;

    @NotNull(message = "Movie id is required")
    private Long movieId;

    @NotNull(message = "Screening Room Price is required")
    private Long screeningRoomId;
}
