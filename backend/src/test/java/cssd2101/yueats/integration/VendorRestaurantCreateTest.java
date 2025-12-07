package cssd2101.yueats.integration;
import com.fasterxml.jackson.databind.ObjectMapper;
import cssd2101.yueats.dto.CustomerSignupRequest;
import cssd2101.yueats.dto.RestaurantCreationRequest;
import cssd2101.yueats.dto.VendorSignupRequest;
import cssd2101.yueats.model.Restaurant;
import cssd2101.yueats.model.User;
import cssd2101.yueats.model.Vendor;
import cssd2101.yueats.repository.RestaurantRepository;
import cssd2101.yueats.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Objects;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@Import(TestConfig.class)
public class VendorRestaurantCreateTest {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

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
    void createVendorFail() throws Exception {
        VendorSignupRequest dto = new VendorSignupRequest("vendor@.com", "", "213123", "test123", "wqeqererfaf", "");

        mockMvc.perform(post("/vendors/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.email").value("Invalid email format"))
                .andExpect(jsonPath("$.firstName").value("First name cannot be blank"))
                .andExpect(jsonPath("$.lastName").value("Last name cannot contain numbers"))
                .andExpect(jsonPath("$.phoneNumber").value("Phone number must only contain 10 digits"))
                .andExpect(jsonPath("$.password").value("Password must be between 8 and 32 characters, contain at least one number, one lowercase letter, one uppercase letter, and one special character"))
                .andExpect(jsonPath("$.businessName").value("Business name cannot be blank"));
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
        RestaurantCreationRequest dto = new RestaurantCreationRequest("five guys", 4, "123 fake street");
        mockMvc.perform(post("/restaurants/create").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto))).andExpect(status().isInternalServerError())
                .andExpect(content().string("User not found"));
    }

    @Test
    void createRestaurantValidatorFail() throws Exception {
        VendorSignupRequest dto = new VendorSignupRequest("vendor@testing.com",
                "restaurant", "vendor", "1234567890", "Password12345!", "YUEatery");

        mockMvc.perform(post("/vendors/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());

        User user = userRepository.findByEmail(dto.email()).orElseThrow(() -> new RuntimeException("User not found"));
        Vendor vendor = (Vendor) user;
        RestaurantCreationRequest dto1 = new RestaurantCreationRequest("", vendor.getId(), "123 fake street");

        mockMvc.perform(post("/restaurants/create")
                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(dto1)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.restaurantName").value("Restaurant name is mandatory"));

        RestaurantCreationRequest dto2 = new RestaurantCreationRequest("testing restaurant", vendor.getId(), "");

        mockMvc.perform(post("/restaurants/create")
                        .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(dto2)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.address").value("Address is mandatory"));

        assertEquals(0, vendor.getOwnedRestaurants().size());
    }

    @Test
    void createDuplicateRestaurant() throws Exception {
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

        RestaurantCreationRequest dupe = new RestaurantCreationRequest("five guys", vendor.getId(), "123 fake street");
        mockMvc.perform(post("/restaurants/create").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dupe)))
                .andExpect(status().isBadRequest())
                        .andExpect(content().string("Restaurant already exists"));


        assertEquals(1, vendor.getOwnedRestaurants().size());
    }
}
