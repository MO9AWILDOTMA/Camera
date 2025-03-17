package ma.cinecamera.model;

import java.time.LocalDateTime;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.cinecamera.model.enums.ShowVersion;

@Getter
@Setter
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "showtimes")
public class Showtime extends BaseEntity {

    @Column(name = "date_time", nullable = false)
    @NotNull(message = "Showtime Date and Time is required")
    private LocalDateTime dateTime;

    @Column(name = "slug", nullable = false, unique = true)
    @NotBlank(message = "Showtime Slug is required")
    @NotNull(message = "Showtime Slug is required")
    private String slug;

    @Column(name = "price", nullable = false)
    @NotNull(message = "Showtime Price is required")
    private Double price;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @JsonManagedReference
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "showtime_discounts", joinColumns = @JoinColumn(name = "showtime_id"), inverseJoinColumns = @JoinColumn(name = "discount_id"))
    private Set<Discount> discounts;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "screening_room_id", nullable = false)
    private ScreeningRoom screeningRoom;

    @Column(name = "show_version", nullable = false)
    @NotNull(message = "Showtime Version is required")
    @Enumerated(EnumType.STRING)
    private ShowVersion showVersion;

    @Column(name = "total_seats", nullable = false)
    @NotNull(message = "Showtime Total Seats is required")
    private int totalSeats;
    @Column(name = "reserved_seats", nullable = false)
    @NotNull(message = "Showtime Reserved Seats is required")
    private int reservedSeats;
    @Column(name = "is_preview", nullable = false)
    @NotNull(message = "Please set true if it is preview or false if isnt")
    private boolean isPreview;
    @Column(name = "is_special_event", nullable = false)
    @NotNull(message = "Please set true if it is special event or false if isnt")
    private boolean isSpecialEvent;

    public boolean isSoldOut() {
	return reservedSeats >= totalSeats;
    }

    public double getReservationPercentage() {
	return (double) reservedSeats / totalSeats;
    }

}
