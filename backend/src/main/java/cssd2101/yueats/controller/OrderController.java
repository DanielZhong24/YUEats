package cssd2101.yueats.controller;

import cssd2101.yueats.dto.OrderCreationRequest;
import cssd2101.yueats.model.Order;
import cssd2101.yueats.service.OrderService;
import cssd2101.yueats.repository.OrderRepository;
import cssd2101.yueats.types.OrderStatus;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository; // Added for easy simulation access

    public OrderController(OrderService orderService, OrderRepository orderRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    /**
     * EXISTING: Create an order as a customer
     */
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody @Valid OrderCreationRequest request) {
        Order newOrder = orderService.createOrder(request);
        return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
    }

    /**
     * VENDOR DASHBOARD: Get all orders for a specific restaurant
     * Use this in React to show the "Live Feed"
     */
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Order>> getRestaurantOrders(@PathVariable Integer restaurantId) {
        List<Order> orders = orderRepository.findByRestaurantId(restaurantId);
        return ResponseEntity.ok(orders);
    }

    /**
     * CUSTOMER DASHBOARD: Get current status of a single order
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        return orderRepository.findById(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * COURIER SIMULATION: Manually trigger pickup
     * This moves the order to IN_TRANSIT, letting the Scheduler
     * finish the delivery in 60 seconds.
     */
    @PatchMapping("/{orderId}/pickup")
    public ResponseEntity<Order> pickupOrder(@PathVariable Long orderId) {
        return orderRepository.findById(orderId).map(order -> {
            order.setStatus(OrderStatus.IN_TRANSIT);
            orderRepository.save(order);
            return ResponseEntity.ok(order);
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * CUSTOMER DASHBOARD: Get all orders for a specific customer
     * Use this to show the "Active Orders" tracking list in React
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getCustomerOrders(@PathVariable Integer customerId) {
        // Note: Ensure you have findByCustomerId in your OrderRepository
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        return ResponseEntity.ok(orders);
    }
}