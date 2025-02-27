package ma.cinecamera.dto.resp;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import ma.cinecamera.model.Discount;
import ma.cinecamera.model.Movie;
import ma.cinecamera.model.Reservation;
import ma.cinecamera.model.ScreeningRoom;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ShowtimeRespDto extends BaseDto {

    private LocalDateTime dateTime;

    private Double price;

    private Movie movie;

    private List<Discount> discounts;

    private List<Reservation> reservations;

    private ScreeningRoom screeningRoom;
}
