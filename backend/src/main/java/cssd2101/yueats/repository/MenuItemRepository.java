package cssd2101.yueats.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cssd2101.yueats.model.MenuItem;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    // Check to see if there is a restaurant and whether it contains an item
    boolean existsByRestaurantIdAndItemName(Integer restaurantId, String itemName);

    List<MenuItem> findByRestaurantId(Integer restaurantId);
}
