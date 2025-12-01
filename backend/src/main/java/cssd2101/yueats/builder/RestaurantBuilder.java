package cssd2101.yueats.builder;

import cssd2101.yueats.dto.RestaurantCreationRequest;
import cssd2101.yueats.model.Restaurant;
import cssd2101.yueats.model.User;
import org.springframework.stereotype.Component;

@Component
public class RestaurantBuilder {
    public Restaurant createRestaurant(RestaurantCreationRequest dto, User owner) {
        return Restaurant.builder()
                .restaurantName(dto.getRestaurantName())
                .owner(owner)
                .address(dto.getAddress())
                .build();

    }
}
