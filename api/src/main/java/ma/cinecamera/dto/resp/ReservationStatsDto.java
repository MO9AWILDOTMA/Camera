package ma.cinecamera.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReservationStatsDto {
    private Long confirmedReservation;
    private Long cancelledReservation;
    private Long inProgressReservation;
    private Long archivedReservation;
}
