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

    public MenuItem createMenuItem(MenuItemCreationRequest req, Integer restaurantId) {
        MenuItem item = restaurantBuilder.createMenuItem(req, restaurantId);
        return menuItemRepository.save(item);


    }
}
