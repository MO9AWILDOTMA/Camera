package ma.cinecamera.dto.resp;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.cinecamera.utils.DateValue;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueData {
    private Double total;
    private Double change;
    private List<DateValue> data;
}
