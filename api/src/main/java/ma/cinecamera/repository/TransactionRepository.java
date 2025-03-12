package ma.cinecamera.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.cinecamera.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

}
