package ma.cinecamera.dto.resp;

import java.util.List;

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
    private List<TicketResp> tickets; // Use DTO instead of entity
    private String[] seats;
    private ReservationStatus status;
}
