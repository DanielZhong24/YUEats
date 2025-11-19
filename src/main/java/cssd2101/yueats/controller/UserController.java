package cssd2101.yueats.controller;

import cssd2101.yueats.model.Customer;
import cssd2101.yueats.model.User;
import cssd2101.yueats.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user")
    public List<User> index() {
        return (List<User>) userRepository.findAll();
    }
}
