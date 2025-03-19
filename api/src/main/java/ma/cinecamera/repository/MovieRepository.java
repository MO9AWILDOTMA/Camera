package ma.cinecamera.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ma.cinecamera.model.Movie;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Optional<Movie> findBySlug(String slug);

    @Query("SELECT DISTINCT m FROM Movie m JOIN m.showtimes s WHERE s.dateTime >= :now")
    List<Movie> findMoviesWithUpcomingShowtimes(@Param("now") LocalDateTime now, Pageable pageable);
}
