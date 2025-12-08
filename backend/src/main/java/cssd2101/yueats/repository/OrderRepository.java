package cssd2101.yueats.repository;

import cssd2101.yueats.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find all orders for a specific customer
    List<Order> findByCustomerId(Integer customerId);

    // Find all orders for a specific restaurant (For the Vendor Dashboard)
    List<Order> findByRestaurantId(Integer restaurantId);

    // Find by Status (e.g., show me all "PENDING" orders)
    List<Order> findByRestaurantIdAndStatus(Integer restaurantId, String status);
}