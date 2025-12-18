package cssd2101.yueats.repository;

import cssd2101.yueats.model.Order;
import cssd2101.yueats.types.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerId(Integer customerId);

    List<Order> findByRestaurantId(Integer restaurantId);

    List<Order> findByStatus(OrderStatus status);

    List<Order> findByStatusIn(List<OrderStatus> statuses);

    List<Order> findByCourierEmail(String email);
}