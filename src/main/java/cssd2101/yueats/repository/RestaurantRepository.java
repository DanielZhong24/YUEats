package cssd2101.yueats.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cssd2101.yueats.model.Restaurant;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
}
