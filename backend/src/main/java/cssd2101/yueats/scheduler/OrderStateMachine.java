package cssd2101.yueats.scheduler;

import cssd2101.yueats.model.Order;
import cssd2101.yueats.repository.OrderRepository;
import cssd2101.yueats.types.OrderStatus;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Component
public class OrderStateMachine {
    // Map containing current status as key, and next status as value
    private static final Map<OrderStatus, OrderStatus> orderStatusMap = Map.of(
            OrderStatus.PENDING, OrderStatus.PREPARING,
            OrderStatus.PREPARING, OrderStatus.READY_FOR_PICKUP);

    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher applicationEventPublisher;


    public OrderStateMachine(OrderRepository orderRepository, ApplicationEventPublisher applicationEventPublisher) {
        this.orderRepository = orderRepository;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    /**
     * Updates the order status to the next status
     * @param order The order with the new status
     */
    public void updateOrderStatus(Order order) {
        // Get current and next status
        OrderStatus orderStatus = order.getStatus();
        OrderStatus nextStatus = orderStatusMap.get(orderStatus);

        if (nextStatus == null) return;
        // Set the orders new status and when it was last updated
        order.setStatus(nextStatus);
        order.setLastUpdated(LocalDateTime.now());

        // If its status is ready for pickup, generate a pickup code to verify afterwards
        if (nextStatus == OrderStatus.READY_FOR_PICKUP) {
            order.setPickupCode(UUID.randomUUID().toString().substring(0,6));
        }

        // Save and create a new event
        orderRepository.save(order);
        applicationEventPublisher.publishEvent(new OrderStatusEvent(order.getId(), nextStatus));
    }

    /**
     * Update the order if it is in transit
     * @param order The order with the new status
     */
    public void updateTransit(Order order) {
        // Set the order status to delivered and create a new event
        order.setStatus(OrderStatus.DELIVERED);
        order.setLastUpdated(LocalDateTime.now());

        orderRepository.save(order);
        applicationEventPublisher.publishEvent(new OrderStatusEvent(order.getId(), OrderStatus.DELIVERED));
    }
}
