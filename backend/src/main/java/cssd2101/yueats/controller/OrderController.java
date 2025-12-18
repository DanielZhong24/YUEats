package cssd2101.yueats.controller;

import cssd2101.yueats.dto.OrderCreationRequest;
import cssd2101.yueats.dto.PickupCodeRequest;
import cssd2101.yueats.model.Order;
import cssd2101.yueats.service.OrderService;
import cssd2101.yueats.repository.OrderRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    public OrderController(OrderService orderService, OrderRepository orderRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    // 1. Create Order
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody @Valid OrderCreationRequest request) {
        Order newOrder = orderService.createOrder(request);
        return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
    }

    // 2. Customer Dashboard: GET /orders/customer/9
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getCustomerOrders(@PathVariable("customerId") Integer customerId) {
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        return ResponseEntity.ok(orders);
    }

    // 3. Vendor Dashboard: GET /orders/restaurant/{id}
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Order>> getRestaurantOrders(@PathVariable("restaurantId") Integer restaurantId) {
        List<Order> orders = orderRepository.findByRestaurantId(restaurantId);
        return ResponseEntity.ok(orders);
    }

    // 4. Courier Dashboard: GET /orders/courier
    @GetMapping("/courier")
    public ResponseEntity<List<Order>> getCourierOrders(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        List<Order> orders = orderRepository.findByCourierEmail(userDetails.getUsername());
        return ResponseEntity.ok(orders);
    }

    // 5. Handshake: POST /orders/{orderId}/vendor-verify
    @PostMapping("/{orderId}/vendor-verify")
    public ResponseEntity<Void> vendorVerifyPickup(
            @PathVariable("orderId") Integer orderId,
            @RequestBody @Valid PickupCodeRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        orderService.vendorVerifyPickup(orderId, req.code(), userDetails.getUsername());
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    // 6. Tracking: GET /orders/{orderId}
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable("orderId") Long orderId) {
        return orderRepository.findById(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(
            @PathVariable("orderId") Long orderId,
            @AuthenticationPrincipal UserDetails userDetails) {
        orderService.cancelOrder(orderId, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}