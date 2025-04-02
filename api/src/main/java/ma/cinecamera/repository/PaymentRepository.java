package ma.cinecamera.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ma.cinecamera.model.Payment;
import ma.cinecamera.model.enums.PaymentStatus;
import ma.cinecamera.utils.DateValue;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByUserIdAndStatus(Long userId, PaymentStatus status);

    List<Payment> findByUserId(Long id);

    List<Payment> findByStatus(PaymentStatus status);

    @Query("SELECT COALESCE(SUM(p.amount), 0) " + "FROM Payment p "
	    + "WHERE p.status = :status AND p.createdAt BETWEEN :start AND :end")
    Optional<Double> sumAmountByStatusAndCreatedAtBetween(@Param("status") PaymentStatus status,
	    @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT CAST(p.createdAt AS date) as date, SUM(p.amount) as value " + "FROM Payment p "
	    + "WHERE p.status = :status AND p.createdAt BETWEEN :start AND :end "
	    + "GROUP BY CAST(p.createdAt AS date) " + "ORDER BY date")
    List<DateValue> findDailyRevenue(@Param("status") PaymentStatus status, @Param("start") LocalDateTime start,
	    @Param("end") LocalDateTime end);

}
