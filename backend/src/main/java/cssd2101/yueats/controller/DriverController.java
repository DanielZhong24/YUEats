package cssd2101.yueats.controller;

import cssd2101.yueats.dto.CustomerSignupRequest;
import cssd2101.yueats.model.DeliveryDriver;
import cssd2101.yueats.model.Order;
import cssd2101.yueats.service.OrderService;
import cssd2101.yueats.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drivers")
public class DriverController {
    private final UserService userService;
    private final OrderService orderService;

    public DriverController(UserService userService, OrderService orderService) {
        this.userService = userService;
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<DeliveryDriver> signup(@Valid @RequestBody CustomerSignupRequest dto) {
        DeliveryDriver deliveryDriver = userService.registerDriver(dto);
        return new ResponseEntity<>(deliveryDriver, HttpStatus.CREATED);
    }

    @GetMapping("/orders/available")
    public ResponseEntity<List<Order>> getAvailableOrders(@AuthenticationPrincipal UserDetails userDetails) {
        List<Order> readyOrders = orderService.getReadyOrders(userDetails);
        return new ResponseEntity<>(readyOrders, HttpStatus.OK);
    }

    @PostMapping("/orders/{id}/claim")
    public ResponseEntity<String> claimOrder(@PathVariable("id") Integer id, @AuthenticationPrincipal UserDetails userDetails) {
        Order order = orderService.claimOrder(id, userDetails.getUsername());
        return new ResponseEntity<>(order.getPickupCode(), HttpStatus.ACCEPTED);
    }

    @PostMapping("/orders/{id}/pickup")
    public ResponseEntity<Order> pickupOrder(@PathVariable("id") Integer id, @RequestBody String code, @AuthenticationPrincipal UserDetails userDetails) {
        orderService.verifyPickup(id, code, userDetails.getUsername());
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

}
