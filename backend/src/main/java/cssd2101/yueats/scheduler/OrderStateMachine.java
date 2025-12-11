package cssd2101.yueats.scheduler;

import cssd2101.yueats.model.Order;
import cssd2101.yueats.repository.OrderRepository;
import cssd2101.yueats.types.OrderStatus;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
public class OrderStateMachine {
    private static final Map<OrderStatus, OrderStatus> orderStatusMap = Map.of(
            OrderStatus.PENDING, OrderStatus.PREPARING,
            OrderStatus.READY_FOR_PICKUP, OrderStatus.DELIVERED);

    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher applicationEventPublisher;


    public OrderStateMachine(OrderRepository orderRepository, ApplicationEventPublisher applicationEventPublisher) {
        this.orderRepository = orderRepository;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    public void updateOrderStatus(Order order) {
        OrderStatus orderStatus = order.getStatus();
        OrderStatus nextStatus = orderStatusMap.get(orderStatus);

        if (nextStatus == null) return;

        order.setStatus(nextStatus);
        if (nextStatus == OrderStatus.READY_FOR_PICKUP) {
            order.setPickupCode(UUID.randomUUID().toString().substring(0,6));
        }

        orderRepository.save(order);

        order.setStatus(nextStatus);
        applicationEventPublisher.publishEvent(new OrderStatusEvent(order.getId(), nextStatus));
    }
}
