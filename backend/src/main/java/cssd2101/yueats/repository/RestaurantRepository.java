package cssd2101.yueats.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cssd2101.yueats.model.Restaurant;

import java.util.Optional;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    // Find a restaurant by their name
    Optional<Restaurant> findByRestaurantName(String name);

    // Check to see if a restaurant exists by name
    boolean existsByRestaurantName(String name);
}
