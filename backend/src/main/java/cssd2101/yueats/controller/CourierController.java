package cssd2101.yueats.controller;

import cssd2101.yueats.dto.CustomerSignupRequest;
import cssd2101.yueats.dto.PickupCodeRequest;
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

    /**
     * Creates a user with the delivery courier role
     * 
     * @param dto Customer Signup Request template
     * @return The response entity with the delivery courier
     */
    @PostMapping
    public ResponseEntity<DeliveryCourier> signup(@Valid @RequestBody CustomerSignupRequest dto) {
        DeliveryCourier deliveryCourier = userService.registerCourier(dto);
        return new ResponseEntity<>(deliveryCourier, HttpStatus.CREATED);
    }

    /**
     * Gets all the orders that have the status of Ready for pickup
     * 
     * @param userDetails The currently signed in delivery courier
     * @return A response entity containing the list of ready orders
     */
    @GetMapping("/orders/available")
    public ResponseEntity<List<Order>> getAvailableOrders(@AuthenticationPrincipal UserDetails userDetails) {
        List<Order> readyOrders = orderService.getReadyOrders(userDetails);
        return new ResponseEntity<>(readyOrders, HttpStatus.OK);
    }

    /**
     * Claim a specific order
     * 
     * @param id          The order id that was claimed
     * @param userDetails The currently signed in delivery courier
     * @return A response entity containing the orders pickup code
     */
    @PostMapping("/orders/{id}/claim")
    public ResponseEntity<String> claimOrder(@PathVariable("id") Integer id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Order order = orderService.claimOrder(id, userDetails.getUsername());
        return new ResponseEntity<>(order.getPickupCode(), HttpStatus.ACCEPTED);
    }

    /**
     * Verifying the order has been picked up by the courier
     * 
     * @param id          The order id
     * @param req         The code that was given to the courier
     * @param userDetails The currently signed in delivery courier
     * @return The response entity with the accepted request status
     */
    @PostMapping("/orders/{id}/pickup")
    public ResponseEntity<Order> pickupOrder(@PathVariable("id") Integer id, @RequestBody @Valid PickupCodeRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        orderService.verifyPickup(id, req.code(), userDetails.getUsername());
        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

}
