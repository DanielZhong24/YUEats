package cssd2101.yueats.factory;

import cssd2101.yueats.dto.CustomerSignupRequest;
import cssd2101.yueats.dto.VendorSignupRequest;
import cssd2101.yueats.model.Customer;
import cssd2101.yueats.model.DeliveryDriver;
import cssd2101.yueats.model.Vendor;
import cssd2101.yueats.types.UserRole;
import org.springframework.stereotype.Component;

@Component
public class UserFactory {
    /**
     * Create a user with the customer role
     * @param dto The information sent from the client with the required information
     * @param hashedPassword The hashed password
     * @return The created customer with the hashed password
     */
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

    /**
     * Create a user with the vendor role
     * @param dto The information sent from the client with the required information
     * @param hashedPassword The hashed password
     * @return The created vendor with the hashed password
     */
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

    /**
     * Create a user with the delivery driver role
     * @param dto The information sent from the client with the required information
     * @param hashedPassword The hashed password
     * @return The created delivery driver with the hashed passwor
     */
    public DeliveryDriver createDriver(CustomerSignupRequest dto, String hashedPassword) {
        return DeliveryDriver.builder()
                .email(dto.email())
                .passwordHash(hashedPassword)
                .firstName(dto.firstName())
                .lastName(dto.lastName())
                .phoneNumber(dto.phoneNumber())
                .userRole(UserRole.COURIER)
                .isVerified(false).build();
    }



}
