package cssd2101.yueats.service;

import cssd2101.yueats.dto.CustomerSignupRequest;
import cssd2101.yueats.dto.VendorSignupRequest;
import cssd2101.yueats.factory.UserFactory;
import cssd2101.yueats.model.Customer;
import cssd2101.yueats.model.DeliveryCourier;
import cssd2101.yueats.model.Vendor;
import cssd2101.yueats.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserFactory userFactory;
    private final BCryptPasswordEncoder encoder;

    public UserService(UserRepository userRepository, UserFactory userFactory,
            BCryptPasswordEncoder bCryptPasswordEncoder, BCryptPasswordEncoder hashConfig) {
        this.userRepository = userRepository;
        this.userFactory = userFactory;
        this.encoder = bCryptPasswordEncoder;
    }

    /**
     * Register a customer
     * 
     * @param dto The information from the request
     * @return The new customer saved in the database
     */
    public Customer registerCustomer(CustomerSignupRequest dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Hash the password using bcrypt, and create the customer with the hashed
        // password
        String hashed = encoder.encode(dto.password());
        Customer customer = userFactory.createCustomer(dto, hashed);

        return userRepository.save(customer);
    }

    /**
     * Register a vendor
     * 
     * @param dto The information from the request
     * @return The new vendor saved in the database
     */
    public Vendor registerVendor(VendorSignupRequest dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Hash the password using bcrypt, and create the vendor with the hashed
        // password
        String hashed = encoder.encode(dto.password());
        Vendor vendor = userFactory.createVendor(dto, hashed);

        return userRepository.save(vendor);
    }

    /**
     * Register a delivery courier
     * 
     * @param dto The information from the request
     * @return The new delivery courier saved in the database
     */
    public DeliveryCourier registerCourier(CustomerSignupRequest dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Hash the password using bcrypt, and create the delivery courier with the
        // hashed password
        String hashed = encoder.encode(dto.password());
        DeliveryCourier courier = userFactory.createCourier(dto, hashed);

        return userRepository.save(courier);
    }

}
