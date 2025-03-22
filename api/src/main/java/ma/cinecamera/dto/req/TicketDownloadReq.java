package ma.cinecamera.dto.req;

import java.util.List;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketDownloadReq {
    @NotNull(message = "Tickets codes is required")
    private List<String> codes;
}
