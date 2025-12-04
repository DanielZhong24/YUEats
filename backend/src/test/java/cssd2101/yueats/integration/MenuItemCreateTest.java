package cssd2101.yueats.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import cssd2101.yueats.dto.MenuItemCreationRequest;
import cssd2101.yueats.dto.RestaurantCreationRequest;
import cssd2101.yueats.dto.VendorSignupRequest;
import cssd2101.yueats.model.Restaurant;
import cssd2101.yueats.model.User;
import cssd2101.yueats.model.Vendor;
import cssd2101.yueats.repository.MenuItemRepository;
import cssd2101.yueats.repository.RestaurantRepository;
import cssd2101.yueats.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
public class MenuItemCreateTest {

    @Autowired
    private MenuItemRepository menuItemRepository;
    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private Vendor vendor;

    private Restaurant restaurant;


    @BeforeEach
    void setup() throws Exception {
        VendorSignupRequest dto = new VendorSignupRequest("vendor@testing.com",
                "restaurant", "vendor", "1234567890", "Password12345!", "YUEatery");

        mockMvc.perform(post("/vendors/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());

        User user = userRepository.findByEmail(dto.email()).orElseThrow(() -> new RuntimeException("User not found"));
        vendor = (Vendor) user;

        RestaurantCreationRequest restaurantDto = new RestaurantCreationRequest("five guys", vendor.getId(), "123 fake street");

        mockMvc.perform(post("/restaurants/create").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(restaurantDto))).andExpect(status().isCreated());

        restaurant = restaurantRepository.findByRestaurantName("five guys").orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    @Test
    void createMenuItem() throws Exception {
        MenuItemCreationRequest dto = new MenuItemCreationRequest("Burger",  "Simple burger", 4.99);

        mockMvc.perform(post("/restaurants/{id}/create-menu", restaurant.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());


        Assertions.assertEquals(1, restaurant.getMenuItems().size());
    }

    @Test
    void createMenuItemFail() throws Exception {
        MenuItemCreationRequest dto = new MenuItemCreationRequest("       ",  "   ", null);

        mockMvc.perform(post("/restaurants/{id}/create-menu", restaurant.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto))).andExpect(status().isBadRequest())
                        .andExpect(jsonPath("$.itemName").value("Name is mandatory"))
                                .andExpect(jsonPath("$.description").value("Description cannot be empty"))
                                        .andExpect(jsonPath("$.price").value("Price is mandatory"));



        MenuItemCreationRequest dto2 = new MenuItemCreationRequest("te",  "Simple burger", 4.99);

        mockMvc.perform(post("/restaurants/{id}/create-menu", restaurant.getId())
        .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto2)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.itemName").value("Name must be between 3 and 30 characters"));

        MenuItemCreationRequest dto3 = new MenuItemCreationRequest("",  "", 4.99);

        mockMvc.perform(post("/restaurants/{id}/create-menu", restaurant.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto3)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.itemName").value("Name is mandatory"))
                .andExpect(jsonPath("$.description").value("Description cannot be empty"));

        Assertions.assertEquals(0, restaurant.getMenuItems().size());


    }
}
