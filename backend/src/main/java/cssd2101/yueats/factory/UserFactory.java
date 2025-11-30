package cssd2101.yueats.factory;

import cssd2101.yueats.dto.CustomerSignupRequest;
import cssd2101.yueats.model.Customer;
import cssd2101.yueats.types.UserRole;
import org.springframework.stereotype.Component;

@Component
public class UserFactory {
    public Customer createCustomer(CustomerSignupRequest dto) {
        return Customer.builder()
               .email(dto.email())
               .passwordHash(dto.password())
               .firstName(dto.firstName())
               .lastName(dto.lastName())
               .phoneNumber(dto.phoneNumber())
               .userRole(UserRole.CUSTOMER)
               .build();

    }
}
