package ma.cinecamera.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
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

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "screening_rooms")
public class ScreeningRoom extends BaseEntity {

    @Column(name = "name", nullable = false, unique = true)
    @NotBlank(message = "Screening Room Name is required")
    @NotNull(message = "Screening Room Name is required")
    private String name;

    @Column(name = "slug", nullable = false, unique = true)
    @NotBlank(message = "Screening Room Slug is required")
    @NotNull(message = "Screening Room Slug is required")
    private String slug;

    @Column(name = "total_seats", nullable = true)
    @NotNull(message = "Screening Room Total Seats is required")
    private Integer totalSeats;

    @Column(name = "row_size", nullable = false)
    @NotNull(message = "Screening Room Row Size is required")
    private Integer rowSize;

    @JsonManagedReference
    @OneToMany(mappedBy = "screeningRoom", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Seat> seats;

    @JsonManagedReference
    @OneToMany(mappedBy = "screeningRoom", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Showtime> showtimes;
}
