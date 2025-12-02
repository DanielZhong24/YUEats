package cssd2101.yueats.builder;

import cssd2101.yueats.dto.RestaurantCreationRequest;
import cssd2101.yueats.model.Restaurant;
import cssd2101.yueats.model.Vendor;
import org.springframework.stereotype.Component;

@Component
public class RestaurantBuilder {
    public Restaurant createRestaurant(RestaurantCreationRequest dto, Vendor owner) {
        Restaurant restaurant = Restaurant.builder()
                .restaurantName(dto.restaurantName())
                .owner(owner)
                .address(dto.address())
                .build();

        owner.addRestaurant(restaurant);
        return restaurant;
    }
}
