package ma.cinecamera.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.cinecamera.model.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Optional<Reservation> findByUserId(Long UserId);
}
