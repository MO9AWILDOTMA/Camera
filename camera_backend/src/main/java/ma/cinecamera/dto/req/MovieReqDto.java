package ma.cinecamera.dto.req;

import java.time.LocalDate;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import lombok.Data;
import ma.cinecamera.model.enums.Genre;

@Data
public class MovieReqDto {
    @NotNull(message = "movie name cannot be null")
    @NotEmpty(message = "movie name cannot be empty")
    private String name;

    private String description;

    @NotNull(message = "movie genre cannot be null")
    @Enumerated(EnumType.STRING)
    private Genre genre;

    @NotNull(message = "movie release date cannot be null")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate releaseDate;

    @NotNull(message = "Movie Duration is required")
    private Integer duration;

    @NotNull(message = "movie actors cannot be null")
    @NotEmpty(message = "movie actors cannot be empty")
    private String actors;

    private MultipartFile[] imageFiles;
}
