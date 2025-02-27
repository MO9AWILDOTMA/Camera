package ma.cinecamera.dto.resp;

import java.time.LocalDate;
import java.util.List;

import javax.persistence.ElementCollection;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import ma.cinecamera.model.Showtime;
import ma.cinecamera.model.enums.Genre;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class MovieRespDto extends BaseDto {
    private String name;

    private String description;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<Genre> genres;

    private LocalDate releaseDate;

    private Integer duration;

    private String[] actors;

    private List<String> picturePaths;

    private List<Showtime> showtimes;

    public MovieRespDto(MovieRespDto dto) {
	this.setId(dto.getId());
	this.setName(dto.getName());
	this.setDescription(dto.getDescription());
	this.setGenres(dto.getGenres());
	this.setReleaseDate(dto.getReleaseDate());
	this.setDuration(dto.getDuration());
	this.setActors(dto.getActors());
	this.setPicturePaths(dto.getPicturePaths());
	this.setShowtimes(dto.getShowtimes());
	this.setCreatedAt(dto.getCreatedAt());
	this.setUpdatedAt(dto.getUpdatedAt());
    }

}
