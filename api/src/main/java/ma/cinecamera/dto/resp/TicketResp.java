package ma.cinecamera.dto.resp;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TicketResp extends BaseDto {
    private String seat;
    private String uniqueCode;
    private LocalDateTime time;
    private String movieTitle;
    private String type;
    private String customerName;
    private String downloadLink;
}
