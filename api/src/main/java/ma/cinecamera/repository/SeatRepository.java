package ma.cinecamera.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.cinecamera.model.Seat;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

}
