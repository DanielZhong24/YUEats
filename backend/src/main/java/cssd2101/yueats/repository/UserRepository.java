package cssd2101.yueats.repository;

import cssd2101.yueats.model.Customer;
import cssd2101.yueats.model.User;
import cssd2101.yueats.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User,Long> {
    // Find a user by their email
    Optional<User> findByEmail(String email);

    // Check to see if a user exists by email
    boolean existsByEmail(String email);

}
