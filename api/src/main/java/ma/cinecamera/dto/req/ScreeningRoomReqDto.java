package ma.cinecamera.dto.req;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class ScreeningRoomReqDto {
    @NotBlank(message = "Screening Room Name is required")
    @NotNull(message = "Screening Room Name is required")
    private String name;

    @NotNull(message = "Screening Room Total Seats is required")
    @Min(value = 50, message = "Screening Room cannot be less than 50 seats")
    private Integer totalSeats;
    @NotNull(message = "Screening Room Row Size is required")
    @Min(value = 5, message = "Screening Room Row sizecannot be less than 5 seats")
    private Integer rowSize;

    private MultipartFile[] imageFiles;
}
