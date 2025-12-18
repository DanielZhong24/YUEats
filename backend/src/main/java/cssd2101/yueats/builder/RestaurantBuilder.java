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

    /**
     * Creates a restaurant from the data sent from the client
     * 
     * @param dto
     * @param owner
     * @return Restaurant
     */
    public Restaurant createRestaurant(RestaurantCreationRequest dto, Vendor owner) {
        // Builds the restaurant
        Restaurant restaurant = Restaurant.builder()
                .restaurantName(dto.restaurantName())
                .owner(owner)
                .address(dto.address())
                .bannerImgUrl(dto.bannerImgUrl())
                .build();
        // Adds the restaurant to the list of owned restaurants by the owner
        owner.addRestaurant(restaurant);
        return restaurant;
    }

    /**
     * Creates a menu item from the request sent from the client
     * 
     * @param dto
     * @param restaurantId
     * @return menuItem, the Menu item created for the specific restaurant
     */
    public MenuItem createMenuItem(MenuItemCreationRequest dto, Integer restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(Long.valueOf(restaurantId))
                .orElseThrow(() -> new RuntimeException("restaurant not found"));

        // Builds the menu item
        MenuItem menuItem = MenuItem.builder()
                .itemName(dto.itemName())
                .price(BigDecimal.valueOf(dto.price()))
                .description(dto.description())
                .restaurant(restaurant)
                .imgUrl(dto.imgUrl())
                .category(dto.category())
                .build();

        // Adds the menu item to the specific restaurant
        restaurant.addMenuItem(menuItem);
        return menuItem;

    }
}
