package ma.cinecamera.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import ma.cinecamera.model.Showtime;
import ma.cinecamera.model.enums.ReservationStatus;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ReservationRespDto extends BaseDto {
    private Showtime showtime; // Use DTO instead of entity
    private TicketResp ticket; // Use DTO instead of entity
    private String seat;
    private ReservationStatus status;
}
