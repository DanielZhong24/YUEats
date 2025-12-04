package cssd2101.yueats.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cssd2101.yueats.model.Restaurant;

import java.util.Optional;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    Optional<Restaurant> findByRestaurantName(String name);
}
