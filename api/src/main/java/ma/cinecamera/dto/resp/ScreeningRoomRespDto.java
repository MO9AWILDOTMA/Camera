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
public class ScreeningRoomRespDto extends BaseDto {
    private String name;
    private String slug;
    private Integer seats;
    private List<String> picturePaths;
}
