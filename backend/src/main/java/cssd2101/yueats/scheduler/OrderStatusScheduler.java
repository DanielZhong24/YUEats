package cssd2101.yueats.scheduler;

import cssd2101.yueats.model.Order;
import cssd2101.yueats.repository.OrderRepository;
import cssd2101.yueats.types.OrderStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderStatusScheduler {
    private final OrderRepository orderRepository;
    private final OrderStateMachine statusMachine;

    public OrderStatusScheduler(OrderRepository orderRepository, OrderStateMachine statusMachine) {
        this.orderRepository = orderRepository;
        this.statusMachine = statusMachine;
    }

    /**
     * Updates orders that are either pending or preparing to its next status
     * (simulates preparing/cooking)
     */
    @Scheduled(fixedRate = 60000)
    private void updateOrder() {
        // 🚨 Only auto-complete orders that have already been STARTED by the chef
        List<OrderStatus> statuses = List.of(OrderStatus.PREPARING);
        List<Order> orders = orderRepository.findByStatusIn(statuses);

        for (Order order : orders) {
            statusMachine.updateOrderStatus(order);
        }
    }

    /**
     * Updates orders that are in transit to delivered (simulates delivering)
     */
    @Scheduled(fixedRate = 60000)
    private void autoDeliver() {
        List<Order> inTransit = orderRepository.findByStatus(OrderStatus.IN_TRANSIT);

        for (Order order : inTransit) {
            statusMachine.updateTransit(order);
        }
    }

}
