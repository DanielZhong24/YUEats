package cssd2101.yueats.builder;

import cssd2101.yueats.dto.MenuItemCreationRequest;
import cssd2101.yueats.dto.RestaurantCreationRequest;
import cssd2101.yueats.model.MenuItem;
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

    public MenuItem createMenuItem(MenuItemCreationRequest dto, Restaurant restaurant) {
        MenuItem menuItem =  MenuItem.builder()
                .itemName(dto.itemName())
                .price(dto.price())
                .description(dto.description())
                .restaurant(dto.restaurant())
                .build();

        restaurant.addMenuItem(menuItem);
        return menuItem;

    }
}
