package cssd2101.yueats.controller;

import cssd2101.yueats.dto.VendorSignupRequest;
import cssd2101.yueats.model.Vendor;
import cssd2101.yueats.service.UserService;
import cssd2101.yueats.validation.ValidationOrder;
import jakarta.validation.groups.Default;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vendors")
public class VendorController {
    private final UserService userService;

    public VendorController(UserService userService){
        this.userService = userService;
    }

    @PostMapping()
    public ResponseEntity<Vendor> signup(@Validated({ValidationOrder.class, Default.class}) @RequestBody VendorSignupRequest dto){
        Vendor vendor = userService.registerVendor(dto);
        return new ResponseEntity<>(vendor, HttpStatus.CREATED);
    }



}
