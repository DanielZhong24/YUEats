package cssd2101.yueats.service;

import cssd2101.yueats.builder.RestaurantBuilder;
import cssd2101.yueats.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

@Service

public class RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final RestaurantBuilder restaurantBuilder;

    public RestaurantService(RestaurantRepository restaurantRepository, RestaurantBuilder restaurantBuilder) {
        this.restaurantRepository = restaurantRepository;
        this.restaurantBuilder = restaurantBuilder;
    }


}
