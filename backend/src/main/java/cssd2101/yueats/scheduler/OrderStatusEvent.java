package cssd2101.yueats.scheduler;

import cssd2101.yueats.types.OrderStatus;

public record OrderStatusEvent(Integer orderId, OrderStatus nextStatus) {
}
