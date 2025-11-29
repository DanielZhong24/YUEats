package cssd2101.yueats.service;

import cssd2101.yueats.dto.CustomerSignupRequest;
import cssd2101.yueats.factory.UserFactory;
import cssd2101.yueats.model.Customer;
import cssd2101.yueats.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserFactory userFactory;

    public UserService(UserRepository userRepository, UserFactory userFactory) {
        this.userRepository = userRepository;
        this.userFactory = userFactory;
    }

    public Customer registerCustomer(CustomerSignupRequest dto){
        if(userRepository.existsByEmail(dto.email())){
            throw new IllegalArgumentException("Email already exists");
        }

        return userRepository.save(userFactory.createCustomer(dto));
    }

}
