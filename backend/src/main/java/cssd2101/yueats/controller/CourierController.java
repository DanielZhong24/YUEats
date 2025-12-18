package cssd2101.yueats.controller;

import cssd2101.yueats.dto.CustomerSignupRequest;
import cssd2101.yueats.model.DeliveryCourier;
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
@RequestMapping("/couriers")
public class CourierController {
    private final UserService userService;
    private final OrderService orderService;

    public CourierController(UserService userService, OrderService orderService) {
        this.userService = userService;
        this.orderService = orderService;
    }

    @PostMapping()
    public ResponseEntity<DeliveryCourier> signup(@Valid @RequestBody CustomerSignupRequest dto) {
        DeliveryCourier deliveryCourier = userService.registerCourier(dto);
        return new ResponseEntity<>(deliveryCourier, HttpStatus.CREATED);
    }

    @GetMapping("/available")
    public ResponseEntity<List<Order>> getAvailableOrders(@AuthenticationPrincipal UserDetails userDetails) {
        List<Order> readyOrders = orderService.getReadyOrders(userDetails);
        return new ResponseEntity<>(readyOrders, HttpStatus.OK);
    }

    @PostMapping("/claim/{id}")
    public ResponseEntity<String> claimOrder(@PathVariable("id") Integer id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Order order = orderService.claimOrder(id, userDetails.getUsername());
        return new ResponseEntity<>(order.getPickupCode(), HttpStatus.ACCEPTED);
    }
}