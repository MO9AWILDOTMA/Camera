package ma.cinecamera.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MostReservedMovies {
    private MovieRespDto movie;
    private Long reservationCount;
}
