package cssd2101.yueats.scheduler;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class OrderEventListener {
    @EventListener
    public void handleOrderEvent(OrderStatusEvent event) {
        System.out.println("Order event received: " + event);
    }
}
