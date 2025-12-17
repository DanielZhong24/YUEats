package cssd2101.yueats.repository;

import cssd2101.yueats.model.Order;
import cssd2101.yueats.types.OrderStatus;
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
    List<Order> findByRestaurantIdAndStatus(Integer restaurantId, OrderStatus status);

    // Find all orders that fall within a list of statuses
    List<Order> findByStatusIn(List<OrderStatus> statuses);

    // Find all orders that have a specific status
    List<Order> findByStatus(OrderStatus status);
}