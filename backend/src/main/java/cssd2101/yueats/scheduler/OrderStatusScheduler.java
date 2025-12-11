package cssd2101.yueats.scheduler;

import cssd2101.yueats.model.Order;
import cssd2101.yueats.repository.OrderRepository;
import cssd2101.yueats.repository.RestaurantRepository;
import cssd2101.yueats.types.OrderStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderStatusScheduler {
    private final RestaurantRepository restaurantRepository;
    private final OrderRepository orderRepository;
    private final OrderStateMachine statusMachine;

    public OrderStatusScheduler(RestaurantRepository restaurantRepository, OrderRepository orderRepository, OrderStateMachine statusMachine) {
        this.restaurantRepository = restaurantRepository;
        this.orderRepository = orderRepository;
        this.statusMachine = statusMachine;
    }

    @Scheduled(fixedRate = 60000)
    private void updateOrder() {
        List<OrderStatus> statuses = List.of(OrderStatus.PENDING, OrderStatus.PREPARING);

        List<Order> orders = orderRepository.findByStatusIn(statuses);

        for (Order order : orders) {
            statusMachine.updateOrderStatus(order);
        }
    }
}
