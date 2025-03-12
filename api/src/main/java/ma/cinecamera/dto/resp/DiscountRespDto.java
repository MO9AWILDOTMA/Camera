package ma.cinecamera.dto.resp;

import java.util.List;

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
public class DiscountRespDto extends BaseDto {
    private String name;
    private Double percentage;
    private List<ShowtimeRespDto> showtimes; // Use DTO instead of entity
}