package ma.cinecamera.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.cinecamera.model.Payment;
import ma.cinecamera.model.enums.PaymentStatus;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByUserIdAndStatus(Long userId, PaymentStatus status);

    List<Payment> findByStatus(PaymentStatus status);

}
