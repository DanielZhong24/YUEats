package cssd2101.yueats.controller;


import cssd2101.yueats.dto.RestaurantCreationRequest;
import cssd2101.yueats.model.Restaurant;
import cssd2101.yueats.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @PostMapping("create")
    public ResponseEntity<Restaurant> createRestaurant(@RequestBody RestaurantCreationRequest restaurant) {
        Restaurant rest = restaurantService.createRestaurant(restaurant);
        return new ResponseEntity<>(rest, HttpStatus.CREATED);
    }
}
