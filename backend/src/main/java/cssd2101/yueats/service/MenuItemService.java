package cssd2101.yueats.service;


import cssd2101.yueats.builder.RestaurantBuilder;
import cssd2101.yueats.dto.MenuItemCreationRequest;
import cssd2101.yueats.model.MenuItem;
import cssd2101.yueats.model.Restaurant;
import cssd2101.yueats.repository.MenuItemRepository;
import cssd2101.yueats.repository.RestaurantRepository;
import cssd2101.yueats.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class MenuItemService {
    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final RestaurantBuilder restaurantBuilder;

    public MenuItemService(MenuItemRepository menuItemRepository, RestaurantRepository restaurantRepository, RestaurantBuilder restaurantBuilder) {
        this.menuItemRepository = menuItemRepository;
        this.restaurantRepository = restaurantRepository;
        this.restaurantBuilder = restaurantBuilder;
    }

    public MenuItem createMenuItem(MenuItemCreationRequest req) {
        Restaurant restaurant = restaurantRepository.findById(Long.valueOf(req.restaurant().getId()))
                .orElseThrow(() -> new RuntimeException("restaurant not found"));

        MenuItem item = restaurantBuilder.createMenuItem(req, restaurant);
        return menuItemRepository.save(item);

    }
}
