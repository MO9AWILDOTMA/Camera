package ma.cinecamera.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tickets")
public class Ticket extends BaseEntity {
    @Column(nullable = false)
    @NotNull(message = "Reservation Seat is required")
    private String seat;

    @OneToOne
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @Column(name = "unique_code", nullable = false, unique = true)
    private String uniqueCode;

    @Column(name = "date_time", nullable = false)
    @NotNull(message = "Showtime Date and Time is required")
    private LocalDateTime time;
    @Column(name = "movie_title", nullable = false)
    private String movieTitle;

    private String type;
    private String customerName;

}
