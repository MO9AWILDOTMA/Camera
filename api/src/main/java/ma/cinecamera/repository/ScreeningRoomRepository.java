package ma.cinecamera.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.cinecamera.model.ScreeningRoom;

public interface ScreeningRoomRepository extends JpaRepository<ScreeningRoom, Long> {
    Optional<ScreeningRoom> findBySlug(String slug);

}
