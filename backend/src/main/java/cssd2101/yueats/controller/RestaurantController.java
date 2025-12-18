package cssd2101.yueats.controller;

import cssd2101.yueats.dto.MenuItemCreationRequest;
import cssd2101.yueats.dto.RestaurantCreationRequest;
import cssd2101.yueats.model.MenuItem;
import cssd2101.yueats.model.Restaurant;
import cssd2101.yueats.model.User;
import cssd2101.yueats.service.MenuItemService;
import cssd2101.yueats.service.RestaurantService;
import cssd2101.yueats.validation.ValidationOrder;
import jakarta.validation.Valid;
import jakarta.validation.groups.Default;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final MenuItemService menuItemService;

    public RestaurantController(RestaurantService restaurantService, MenuItemService menuItemService) {
        this.restaurantService = restaurantService;
        this.menuItemService = menuItemService;
    }

    /**
     * Create a restaurant as a vendor
     * 
     * @param restaurant The request containing the necessary information for
     *                   creating a restaurant
     * @return A response entity with the restaurant created
     */
    @PostMapping()
    public ResponseEntity<Restaurant> createRestaurant(
            @Validated({ ValidationOrder.class, Default.class }) @RequestBody RestaurantCreationRequest restaurant) {
        Restaurant rest = restaurantService.createRestaurant(restaurant);
        return new ResponseEntity<>(rest, HttpStatus.CREATED);
    }

    /**
     * Create a menu item
     * 
     * @param menuItem The request sent from the client with the necessary
     *                 information to create an item
     * @param id       The restaurant ID
     * @return A response entity with the created item
     */
    @PostMapping("/{id}/menu-items")
    public ResponseEntity<MenuItem> createMenuItem(
            @Validated({ ValidationOrder.class, Default.class }) @RequestBody MenuItemCreationRequest menuItem,
            @PathVariable Integer id) {

        MenuItem item = menuItemService.createMenuItem(menuItem, id);
        return new ResponseEntity<>(item, HttpStatus.CREATED);

    }

    @GetMapping("/{id}/menu-items")
    public ResponseEntity<List<MenuItem>> getRestaurantMenu(@PathVariable Integer id) {
        List<MenuItem> items = menuItemService.getItemsByRestaurantId(id);
        return ResponseEntity.ok(items);
    }

    /**
     * Update a menu item (e.g. change price, toggle availability)
     */
    @PutMapping("/{restaurantId}/menu-items/{itemId}")
    public ResponseEntity<MenuItem> updateMenuItem(
            @PathVariable Integer restaurantId,
            @PathVariable Long itemId, // Assuming MenuItem ID is Long
            @RequestBody MenuItemCreationRequest request) {

        MenuItem updatedItem = menuItemService.updateMenuItem(itemId, request);
        return ResponseEntity.ok(updatedItem);
    }

    /**
     * Delete a menu item
     */
    @DeleteMapping("/{restaurantId}/menu-items/{itemId}")
    public ResponseEntity<Void> deleteMenuItem(
            @PathVariable Integer restaurantId,
            @PathVariable Long itemId) {

        menuItemService.deleteMenuItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        // 1. Call the service to handle deletion logic
        restaurantService.deleteRestaurant(id);

        // 2. Return 204 No Content (Standard for successful deletes)
        return ResponseEntity.noContent().build();
    }
}
