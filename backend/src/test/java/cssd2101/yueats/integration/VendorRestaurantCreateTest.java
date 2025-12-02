package cssd2101.yueats.integration;
import com.fasterxml.jackson.databind.ObjectMapper;
import cssd2101.yueats.dto.CustomerSignupRequest;
import cssd2101.yueats.dto.RestaurantCreationRequest;
import cssd2101.yueats.dto.VendorSignupRequest;
import cssd2101.yueats.model.Restaurant;
import cssd2101.yueats.model.User;
import cssd2101.yueats.model.Vendor;
import cssd2101.yueats.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Objects;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
public class VendorRestaurantCreateTest {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;



    @Test
    void createVendor() throws Exception {
        VendorSignupRequest dto = new VendorSignupRequest("vendor@vending.com",
                "vendor", "tester", "1234567890", "Password123!", "YUEats");

        mockMvc.perform(post("/vendors/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());
    }

    @Test
    void createRestaurant() throws Exception {
        VendorSignupRequest dto = new VendorSignupRequest("vendor@testing.com",
                "restaurant", "vendor", "1234567890", "Password12345!", "YUEatery");

        mockMvc.perform(post("/vendors/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());

        User user = userRepository.findByEmail(dto.email()).orElseThrow(() -> new RuntimeException("User not found"));
        Vendor vendor = (Vendor) user;

        RestaurantCreationRequest restaurantDto = new RestaurantCreationRequest("five guys", vendor.getId(), "123 fake street");

        mockMvc.perform(post("/restaurants/create").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(restaurantDto))).andExpect(status().isCreated());

        RestaurantCreationRequest restaurantDto2 = new RestaurantCreationRequest("popeyes", vendor.getId(), "345 down street");
        mockMvc.perform(post("/restaurants/create").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(restaurantDto2))).andExpect(status().isCreated());

        assertEquals(2, vendor.getOwnedRestaurants().size());
    }

    @Test
    void createRestaurantFail() throws Exception {
        CustomerSignupRequest dto = new CustomerSignupRequest("notavendor@test.com", "notavendor", "fake", "1234567890", "Password1234!");

        mockMvc.perform(post("/customers/signup").contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(dto))).andExpect(status().isCreated());

        User user = userRepository.findByEmail(dto.email()).orElseThrow(() -> new RuntimeException("User not found"));

        RestaurantCreationRequest restaurantDto = new RestaurantCreationRequest("five guys", user.getId(), "123 fake street");
        mockMvc.perform(post("/restaurants/create").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(restaurantDto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User is not a vendor"));
    }

    @Test
    void createRestaurantNoUser() throws Exception {
        RestaurantCreationRequest dto = new RestaurantCreationRequest("five guys", 1, "123 fake street");
        mockMvc.perform(post("/restaurants/create").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto))).andExpect(status().isInternalServerError())
                .andExpect(content().string("User not found"));
    }
}
