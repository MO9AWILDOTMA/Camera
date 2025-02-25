package ma.cinecamera.model;

import java.time.LocalDate;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.cinecamera.model.enums.Genre;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "movies")
public class Movie extends BaseEntity {
    @Column(name = "name", nullable = false, unique = true)
    @NotBlank(message = "Movie Name is required")
    @NotNull(message = "Movie Name is required")
    private String name;

    @Column(name = "description", nullable = true)
    private String description;

    @Column(name = "genre", nullable = false)
    @NotNull(message = "Movie Genre is required")
    @Enumerated(EnumType.STRING)
    private Genre genre;

    @Column(name = "release_date", nullable = false)
    @NotNull(message = "Movie Release Date is required")
    private LocalDate releaseDate;

    @Column(name = "duration", nullable = false)
    @NotNull(message = "Movie Duration is required")
    private Integer duration;

    @Column(name = "actors", nullable = false)
    @NotBlank(message = "Movie Actors is required")
    @NotNull(message = "Movie Actors is required")
    private String actors;

    @JsonManagedReference
    @OneToMany(mappedBy = "movie", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Showtime> showtimes;

}
