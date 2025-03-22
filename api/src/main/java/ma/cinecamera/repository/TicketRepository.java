package ma.cinecamera.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ma.cinecamera.model.Ticket;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUniqueCodeIn(List<String> codes);

    boolean existsByUniqueCodeIn(List<String> codes);
}
