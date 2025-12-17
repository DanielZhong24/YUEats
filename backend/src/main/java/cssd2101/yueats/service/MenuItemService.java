package cssd2101.yueats.service;


import cssd2101.yueats.builder.RestaurantBuilder;
import cssd2101.yueats.dto.MenuItemCreationRequest;
import cssd2101.yueats.model.MenuItem;
import cssd2101.yueats.repository.MenuItemRepository;
import org.springframework.stereotype.Service;

@Service
public class MenuItemService {
    private final MenuItemRepository menuItemRepository;
    private final RestaurantBuilder restaurantBuilder;

    public MenuItemService(MenuItemRepository menuItemRepository, RestaurantBuilder restaurantBuilder) {
        this.menuItemRepository = menuItemRepository;
        this.restaurantBuilder = restaurantBuilder;
    }

    /**
     * Create a menu item using the builder pattern
     * @param req The request sent from the client
     * @param restaurantId The restaurant ID
     * @return The created restaurant saved in the database
     */
    public MenuItem createMenuItem(MenuItemCreationRequest req, Integer restaurantId) {

        if (menuItemRepository.existsByRestaurantIdAndItemName(restaurantId, req.itemName())) {
            throw new IllegalArgumentException("Menu item already exists in this restaurant");
        }

        MenuItem item = restaurantBuilder.createMenuItem(req, restaurantId);
        return menuItemRepository.save(item);


    }
}
