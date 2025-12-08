package cssd2101.yueats.builder;

import cssd2101.yueats.dto.MenuItemCreationRequest;
import cssd2101.yueats.dto.RestaurantCreationRequest;
import cssd2101.yueats.model.MenuItem;
import cssd2101.yueats.model.Restaurant;
import cssd2101.yueats.model.Vendor;
import org.springframework.stereotype.Component;
import cssd2101.yueats.repository.RestaurantRepository;

import java.math.BigDecimal;


@Component
public class RestaurantBuilder {

    private final RestaurantRepository restaurantRepository;

    public RestaurantBuilder(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    public Restaurant createRestaurant(RestaurantCreationRequest dto, Vendor owner) {
        Restaurant restaurant = Restaurant.builder()
                .restaurantName(dto.restaurantName())
                .owner(owner)
                .address(dto.address())
                .build();

        owner.addRestaurant(restaurant);
        return restaurant;
    }

    public MenuItem createMenuItem(MenuItemCreationRequest dto, Integer restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(Long.valueOf(restaurantId))
                .orElseThrow(() -> new RuntimeException("restaurant not found"));

        MenuItem menuItem =  MenuItem.builder()
                .itemName(dto.itemName())
                .price(BigDecimal.valueOf(dto.price()))
                .description(dto.description())
                .restaurant(restaurant)
                .build();

        restaurant.addMenuItem(menuItem);
        return menuItem;

    }
}
