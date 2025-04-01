package ma.cinecamera.model;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.cinecamera.model.enums.SeatStatus;

@Getter
@Setter
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "seats")

public class Seat extends BaseEntity {
    String row;
    Integer number;
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "screening_room_id", nullable = false)
    private ScreeningRoom screeningRoom;
    SeatStatus status;
}
