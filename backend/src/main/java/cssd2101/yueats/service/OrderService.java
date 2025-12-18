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

    /**
     * Create an order by customer
     * 
     * @param request The request sent from the client containing information to
     *                create an order
     * @return The order saved in the database
     */
    @Transactional
    public Order createOrder(OrderCreationRequest request) {

        User customer = userRepository.findById(Long.valueOf(request.customerId()))
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Restaurant restaurant = restaurantRepository.findById(Long.valueOf(request.restaurantId()))
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        // Manually create order with the information
        Order order = new Order();
        order.setCustomer(customer);
        order.setRestaurant(restaurant);
        order.setDeliveryAddress(request.deliveryAddress());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        BigDecimal calculatedTotal = BigDecimal.ZERO;
        List<OrderDetail> detailsList = new ArrayList<>();

        // Search for items
        for (OrderItemRequest itemDTO : request.items()) {
            MenuItem dbItem = menuItemRepository.findById(Long.valueOf(itemDTO.menuItemId()))
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));

            if (!dbItem.getRestaurant().getId().equals(restaurant.getId())) {
                throw new RuntimeException("Item " + dbItem.getItemName() + " is not from this restaurant");
            }

            // Manually create order details with the information
            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setMenuItem(dbItem);
            detail.setQuantity(itemDTO.quantity());
            detail.setPriceAtPurchase(dbItem.getPrice());

            BigDecimal lineTotal = dbItem.getPrice().multiply(BigDecimal.valueOf(itemDTO.quantity()));
            calculatedTotal = calculatedTotal.add(lineTotal);

            detailsList.add(detail);
        }

        // Set the price, details and save to database
        order.setTotalPrice(calculatedTotal);
        order.setOrderDetails(detailsList); // Cascade will save these automatically

        return orderRepository.save(order);
    }

    /**
     * Verify that the order has been picked up by the courier
     * 
     * @param orderId The order ID
     * @param code    The pickup code
     * @param email   The courier's email
     */
    public void verifyPickup(Integer orderId, String code, String email) {
        Order order = orderRepository.findById(Long.valueOf(orderId))
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (order.getStatus() != OrderStatus.PICKED_UP) {
            throw new IllegalStateException("Order was not chosen by the delivery courier");
        }

        if (!order.getPickupCode().equals(code)) {
            throw new IllegalStateException("Order code is incorrect");
        }

        if (!order.getCourier().getEmail().equals(email)) {
            throw new IllegalStateException("This order is not assigned to you");
        }

        // If it passes the previous checks, set the status to in transit
        // Update the order in the database
        order.setStatus(OrderStatus.IN_TRANSIT);
        order.setLastUpdated(LocalDateTime.now());
        orderRepository.save(order);
    }

    /**
     * Get all orders with the ready for pickup status
     * 
     * @param userDetails The logged in delivery couriers details
     * @return List of orders that have the ready for pickup status
     */
    public List<Order> getReadyOrders(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        DeliveryCourier courier = (DeliveryCourier) user;
        if (courier.getUserRole() != UserRole.COURIER) {
            throw new IllegalStateException("Only couriers can be picked up");
        }
        return orderRepository.findByStatus(OrderStatus.READY_FOR_PICKUP);
    }

    /**
     * Claim an order
     * 
     * @param orderId The order ID
     * @param email   The delivery courier's email
     * @return The order that was claimed
     */
    @Transactional
    public Order claimOrder(Integer orderId, String email) {
        if (orderId == null) {
            throw new NullPointerException("Order id is null");
        }

        // Find order by the given id
        Order order = orderRepository.findById(Long.valueOf(orderId))
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (order.getStatus() != OrderStatus.READY_FOR_PICKUP) {
            throw new IllegalStateException("Order status is not ready yet");
        }
        // Find user with the given email
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Convert type to delivery courier
        DeliveryCourier courier = (DeliveryCourier) user;

        // Update order details with courier, new status
        order.setCourier(courier);
        order.setStatus(OrderStatus.PICKED_UP);
        order.setLastUpdated(LocalDateTime.now());

        orderRepository.save(order);
        return order;
    }
}