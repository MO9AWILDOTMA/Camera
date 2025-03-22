package ma.cinecamera.dto.req;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotNull;

import lombok.Data;
import ma.cinecamera.model.enums.ShowVersion;

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

    @NotNull(message = "Showtime Version is required")
    @Enumerated(EnumType.STRING)
    private ShowVersion showVersion;

    private List<Long> discountIds;

    @NotNull(message = "Showtime Total Seats is required")
    private Integer totalSeats;

    @NotNull(message = "Please set true if it is preview or false if isnt")
    private boolean isPreview;

    @NotNull(message = "Please set true if it is special event or false if isnt")
    private boolean isSpecialEvent;
}
