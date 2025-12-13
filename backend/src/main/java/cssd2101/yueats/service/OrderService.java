package cssd2101.yueats.service;

import cssd2101.yueats.dto.OrderCreationRequest;
import cssd2101.yueats.dto.OrderItemRequest;
import cssd2101.yueats.model.*;
import cssd2101.yueats.repository.*;
import cssd2101.yueats.types.OrderStatus;
import jakarta.transaction.Transactional;
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

            if (!dbItem.getRestaurant().getId().equals(restaurant.getId())) {
                throw new RuntimeException("Item " + dbItem.getItemName() + " is not from this restaurant");
            }

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setMenuItem(dbItem);
            detail.setQuantity(itemDTO.quantity());
            detail.setPriceAtPurchase(dbItem.getPrice());

            BigDecimal lineTotal = dbItem.getPrice().multiply(BigDecimal.valueOf(itemDTO.quantity()));
            calculatedTotal = calculatedTotal.add(lineTotal);

            detailsList.add(detail);
        }

        order.setTotalPrice(calculatedTotal);
        order.setOrderDetails(detailsList); // Cascade will save these automatically

        return orderRepository.save(order);
    }

    public void verifyPickup(Integer orderId, String code, String email) {
        Order order = orderRepository.findById(Long.valueOf(orderId)).orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (order.getStatus() != OrderStatus.PICKED_UP) {
            throw new IllegalStateException("Order was not chosen by the delivery driver");
        }

        if (!order.getPickupCode().equals(code)) {
            throw new  IllegalStateException("Order code is incorrect");
        }

        if (!order.getDriver().getEmail().equals(email)) {
            throw new  IllegalStateException("This order is not assigned to you");
        }

        order.setStatus(OrderStatus.IN_TRANSIT);
        order.setLastUpdated(LocalDateTime.now());
        orderRepository.save(order);
    }

    public List<Order> getReadyOrders() {
        return orderRepository.findByStatus(OrderStatus.READY_FOR_PICKUP);
    }

    @Transactional
    public void claimOrder(Integer orderId, String email) {
        Order order = orderRepository.findById(Long.valueOf(orderId)).orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (order.getStatus() != OrderStatus.READY_FOR_PICKUP) {
            throw new IllegalStateException("Order status is not ready yet");
        }

        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));

        DeliveryDriver driver = (DeliveryDriver) user;

        order.setDriver(driver);
        order.setStatus(OrderStatus.PICKED_UP);
        order.setLastUpdated(LocalDateTime.now());

        orderRepository.save(order);
    }
}