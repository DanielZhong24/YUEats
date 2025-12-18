package cssd2101.yueats.service;

import cssd2101.yueats.builder.RestaurantBuilder;
import cssd2101.yueats.dto.MenuItemCreationRequest;
import cssd2101.yueats.model.MenuItem;
import cssd2101.yueats.repository.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

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
     * 
     * @param req          The request sent from the client
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

    public List<MenuItem> getItemsByRestaurantId(Integer restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    public MenuItem updateMenuItem(Long itemId, MenuItemCreationRequest req) {
        // 1. Find the existing item
        MenuItem item = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found with ID: " + itemId));

        // 2. Update fields
        // Note: Adjust these getters if your DTO field names are different
        item.setItemName(req.itemName());
        item.setDescription(req.description());
        item.setPrice(BigDecimal.valueOf(req.price()));
        item.setImgUrl(req.imgUrl());

        // Ensure your DTO has these fields now
        item.setAvailable(req.isAvailable());
        item.setCategory(req.category());

        // 3. Save
        return menuItemRepository.save(item);
    }

    public void deleteMenuItem(Long itemId) {
        if (!menuItemRepository.existsById(itemId)) {
            throw new RuntimeException("Cannot delete. Item not found with ID: " + itemId);
        }
        menuItemRepository.deleteById(itemId);
    }
}
