package ma.cinecamera.dto.resp;

import java.time.LocalDateTime;
import java.util.Set;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import ma.cinecamera.model.enums.ShowVersion;

@Setter
@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ShowtimeRespDto extends BaseDto {
    private String slug;
    private LocalDateTime dateTime;
    private Double price;
    private MovieRespDto movie; // Use DTO instead of entity
    private Set<DiscountRespDto> discounts; // Use DTO instead of entity
    @Enumerated(EnumType.STRING)
    private ShowVersion showVersion;
    private int totalSeats;
    private int reservedSeats;
    private boolean isPreview;
    private boolean isSpecialEvent;

}
