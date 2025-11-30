package cssd2101.yueats.controller;

import cssd2101.yueats.dto.CustomerSignupRequest;
import cssd2101.yueats.model.Customer;
import cssd2101.yueats.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/customers")
public class CustomerController {
    private final UserService userService;

    public CustomerController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("signup")
    public ResponseEntity<Customer> signup(@RequestBody CustomerSignupRequest dto){
        Customer customer = userService.registerCustomer(dto);
        return new ResponseEntity<>(customer, HttpStatus.CREATED);
    }
}
