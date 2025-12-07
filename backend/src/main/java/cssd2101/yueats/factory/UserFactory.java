package cssd2101.yueats.factory;

import cssd2101.yueats.dto.CustomerSignupRequest;
import cssd2101.yueats.dto.VendorSignupRequest;
import cssd2101.yueats.model.Customer;
import cssd2101.yueats.model.Vendor;
import cssd2101.yueats.types.UserRole;
import org.springframework.stereotype.Component;

@Component
public class UserFactory {
    public Customer createCustomer(CustomerSignupRequest dto, String hashedPassword) {
        return Customer.builder()
                .email(dto.email())
                .passwordHash(hashedPassword)
                .firstName(dto.firstName())
                .lastName(dto.lastName())
                .phoneNumber(dto.phoneNumber())
                .userRole(UserRole.CUSTOMER)
                .isVerified(false).build();

    }
    public Vendor createVendor(VendorSignupRequest dto, String hashedPassword) {
        return Vendor.builder()
                .email(dto.email())
                .passwordHash(hashedPassword)
                .firstName(dto.firstName())
                .lastName(dto.lastName())
                .phoneNumber(dto.phoneNumber())
                .userRole(UserRole.VENDOR)
                .isVerified(false)
                .businessName(dto.businessName()).build();

    }



}
