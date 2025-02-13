package ma.cinecamera.dto.req;

import java.time.LocalDate;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;

import lombok.Data;
import ma.cinecamera.model.enums.Genre;

@Data
public class MovieReqDto {
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    private Genre genre;

    private LocalDate releaseDate;

    private Integer duration;

    private String actors;

    private String picture;
}
