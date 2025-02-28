package ma.cinecamera.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.cinecamera.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByUserId(Long userId);

}
