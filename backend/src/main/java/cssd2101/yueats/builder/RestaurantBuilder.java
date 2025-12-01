package cssd2101.yueats.builder;

import cssd2101.yueats.dto.RestaurantCreationRequest;
import cssd2101.yueats.model.Restaurant;
import org.springframework.stereotype.Component;

@Component
public class RestaurantBuilder {
    public Restaurant createRestaurant(RestaurantCreationRequest dto) {
        return Restaurant.builder().id(dto.getId())
                .restaurantName(dto.getRestaurantName())
                .owner(dto.getOwner())
                .address(dto.getAddress())
                .build();

    }
}
