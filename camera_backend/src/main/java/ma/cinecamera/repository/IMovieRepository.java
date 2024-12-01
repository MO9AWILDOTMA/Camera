package ma.cinecamera.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.cinecamera.model.Movie;

@Repository
public interface IMovieRepository extends JpaRepository<Movie, Long> {

}
