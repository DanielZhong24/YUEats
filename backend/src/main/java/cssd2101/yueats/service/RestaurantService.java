package cssd2101.yueats.service;

import cssd2101.yueats.builder.RestaurantBuilder;
import cssd2101.yueats.dto.RestaurantCreationRequest;
import cssd2101.yueats.model.Restaurant;
import cssd2101.yueats.model.User;
import cssd2101.yueats.model.Vendor;
import cssd2101.yueats.repository.RestaurantRepository;
import cssd2101.yueats.repository.UserRepository;
import cssd2101.yueats.types.UserRole;
import org.springframework.stereotype.Service;

@Service
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;
    private final RestaurantBuilder restaurantBuilder;

    public RestaurantService(RestaurantRepository restaurantRepository, UserRepository userRepository, RestaurantBuilder restaurantBuilder) {
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
        this.restaurantBuilder = restaurantBuilder;
    }

    public Restaurant createRestaurant(RestaurantCreationRequest req) {
        User user = userRepository.findById(Long.valueOf(req.ownerId())).
                orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getUserRole() != UserRole.VENDOR) {
            throw new IllegalArgumentException("User is not a vendor");
        }

        if (restaurantRepository.existsByRestaurantName(req.restaurantName())) {
            throw new IllegalArgumentException("Restaurant already exists");
        }

        Vendor vendor = (Vendor) user;
        Restaurant restaurant = restaurantBuilder.createRestaurant(req, vendor);
        return restaurantRepository.save(restaurant);
    }
}
