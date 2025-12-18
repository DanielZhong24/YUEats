package cssd2101.yueats.controller;

import cssd2101.yueats.dto.VendorSignupRequest;
import cssd2101.yueats.model.Restaurant;
import cssd2101.yueats.model.User;
import cssd2101.yueats.model.Vendor;
import cssd2101.yueats.repository.UserRepository;
import cssd2101.yueats.service.UserService;
import cssd2101.yueats.validation.ValidationOrder;
import jakarta.validation.groups.Default;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/vendors")
public class VendorController {
    private final UserService userService;
    private final UserRepository userRepository;

    public VendorController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    /**
     * Create a user with the vendor role
     * 
     * @param dto The request information needed to create a vendor
     * @return The response entity containing the vendor information
     */
    @PostMapping()
    public ResponseEntity<Vendor> signup(
            @Validated({ ValidationOrder.class, Default.class }) @RequestBody VendorSignupRequest dto) {
        Vendor vendor = userService.registerVendor(dto);
        return new ResponseEntity<>(vendor, HttpStatus.CREATED);
    }

    @GetMapping("/me/restaurants")
    public ResponseEntity<List<Restaurant>> getMyRestaurants(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        // User user = userRepository.findById(1L)
        // .orElseThrow(() -> new RuntimeException("Test User 1 not found"));
        if (!(user instanceof Vendor vendor)) {
            // Not a vendor — return empty list or 403 depending on desired behavior
            return ResponseEntity.status(403).body(Collections.emptyList());
        }

        List<Restaurant> restaurants = vendor.getOwnedRestaurants();
        return ResponseEntity.ok(restaurants);
    }

}
