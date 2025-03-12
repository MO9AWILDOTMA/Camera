package ma.cinecamera.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.cinecamera.model.Discount;

public interface DiscountRepository extends JpaRepository<Discount, Long> {

}
