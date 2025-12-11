package cssd2101.yueats.scheduler;

import cssd2101.yueats.repository.OrderRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class OrderStatusScheduler {
    private final OrderRepository orderRepository;
    private final OrderStateMachine statusMachine;

    public OrderStatusScheduler(OrderRepository orderRepository, OrderStateMachine statusMachine) {
        this.orderRepository = orderRepository;
        this.statusMachine = statusMachine;
    }

    @Scheduled(fixedRate = 10000)
    private void autoCook() {

    }
}
