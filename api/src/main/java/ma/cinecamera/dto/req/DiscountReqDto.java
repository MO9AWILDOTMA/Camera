package ma.cinecamera.dto.req;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiscountReqDto {
    @NotNull(message = "Discount Name is required")
    private String name;

    @NotNull(message = "Discount Percentage is required")
    private Double percentage;

}
