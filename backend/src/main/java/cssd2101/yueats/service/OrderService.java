package cssd2101.yueats.service;

import cssd2101.yueats.dto.OrderCreationRequest;
import cssd2101.yueats.dto.OrderItemRequest;
import cssd2101.yueats.model.*;
import cssd2101.yueats.repository.*;
import cssd2101.yueats.types.OrderStatus;
import cssd2101.yueats.types.UserRole;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;

    public OrderService(OrderRepository orderRepo, MenuItemRepository menuRepo,
            UserRepository userRepo, RestaurantRepository restRepo) {
        this.orderRepository = orderRepo;
        this.menuItemRepository = menuRepo;
        this.userRepository = userRepo;
        this.restaurantRepository = restRepo;
    }

    @Transactional
    public Order createOrder(OrderCreationRequest request) {
        User customer = userRepository.findById(Long.valueOf(request.customerId()))
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Restaurant restaurant = restaurantRepository.findById(Long.valueOf(request.restaurantId()))
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        Order order = new Order();
        order.setCustomer(customer);
        order.setRestaurant(restaurant);
        order.setDeliveryAddress(request.deliveryAddress());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        BigDecimal calculatedTotal = BigDecimal.ZERO;
        List<OrderDetail> detailsList = new ArrayList<>();

        for (OrderItemRequest itemDTO : request.items()) {
            MenuItem dbItem = menuItemRepository.findById(Long.valueOf(itemDTO.menuItemId()))
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setMenuItem(dbItem);
            detail.setQuantity(itemDTO.quantity());
            detail.setPriceAtPurchase(dbItem.getPrice());

            calculatedTotal = calculatedTotal.add(dbItem.getPrice().multiply(BigDecimal.valueOf(itemDTO.quantity())));
            detailsList.add(detail);
        }

        order.setTotalPrice(calculatedTotal);
        order.setOrderDetails(detailsList);
        return orderRepository.save(order);
    }

    @Transactional
    public Order claimOrder(Integer orderId, String email) {
        Order order = orderRepository.findById(Long.valueOf(orderId))
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (order.getStatus() != OrderStatus.READY_FOR_PICKUP) {
            throw new IllegalStateException("Order is not ready for collection");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        order.setCourier((DeliveryCourier) user);
        order.setStatus(OrderStatus.PICKED_UP);
        order.setLastUpdated(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Transactional
    public void vendorVerifyPickup(Integer orderId, String code, String vendorEmail) {
        Order order = orderRepository.findById(Long.valueOf(orderId))
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (!order.getRestaurant().getOwner().getEmail().equals(vendorEmail)) {
            throw new IllegalStateException("You are not authorized to verify this order.");
        }

        if (order.getPickupCode() == null || !order.getPickupCode().equalsIgnoreCase(code)) {
            throw new IllegalStateException(
                    "Invalid pickup code. Expected: " + order.getPickupCode() + ", Received: " + code);
        }

        order.setStatus(OrderStatus.IN_TRANSIT);
        order.setLastUpdated(LocalDateTime.now());
        orderRepository.save(order);
    }

    public List<Order> getReadyOrders(UserDetails userDetails) {
        return orderRepository.findByStatus(OrderStatus.READY_FOR_PICKUP);
    }

    @Transactional
    public void cancelOrder(Long orderId, String customerEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        // Only allow cancellation if the order belongs to the customer
        if (!order.getCustomer().getEmail().equals(customerEmail)) {
            throw new IllegalStateException("Unauthorized: This is not your order");
        }

        // Only allow cancellation before the kitchen starts preparing
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalStateException("Order cannot be cancelled once preparation has started.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setLastUpdated(LocalDateTime.now());
        orderRepository.save(order);
    }
}