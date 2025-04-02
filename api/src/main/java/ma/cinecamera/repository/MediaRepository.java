package ma.cinecamera.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.cinecamera.model.Media;
import ma.cinecamera.model.enums.MediaCategory;
import ma.cinecamera.model.enums.MediaType;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long>{

    List<Media> findByMediaTypeAndOwnerId(MediaType type, Long id);

    List<Media> findByMediaTypeAndOwnerIdAndMediaCategory(MediaType movie, Long movieId, MediaCategory video);

}
