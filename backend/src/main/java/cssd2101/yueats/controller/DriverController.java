package cssd2101.yueats.controller;

import cssd2101.yueats.dto.CustomerSignupRequest;
import cssd2101.yueats.model.DeliveryDriver;
import cssd2101.yueats.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/delivery")
public class DriverController {
    private final UserService userService;

    public DriverController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<DeliveryDriver> signup(@Valid @RequestBody CustomerSignupRequest dto) {
        DeliveryDriver deliveryDriver = userService.registerDriver(dto);
        return new ResponseEntity<>(deliveryDriver, HttpStatus.CREATED);
    }
}
