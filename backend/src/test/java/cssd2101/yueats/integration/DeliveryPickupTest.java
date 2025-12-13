package cssd2101.yueats.integration;


import com.fasterxml.jackson.databind.ObjectMapper;
import cssd2101.yueats.dto.*;
import cssd2101.yueats.model.*;
import cssd2101.yueats.repository.MenuItemRepository;
import cssd2101.yueats.repository.OrderRepository;
import cssd2101.yueats.repository.RestaurantRepository;
import cssd2101.yueats.repository.UserRepository;
import cssd2101.yueats.service.OrderService;
import cssd2101.yueats.types.UserRole;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@Import(TestConfig.class)
public class DeliveryPickupTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderService orderService;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private DeliveryDriver driver;
    private Order order;

    private User customer;
    private Restaurant restaurant;

    @BeforeEach
    void setup() throws Exception {
        CustomerSignupRequest driverDto = new CustomerSignupRequest("driver@test.com", "Driver", "Tester", "1234567890",
                "Password123!");

        mockMvc.perform(post("/drivers").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(driverDto)))
                .andExpect(status().isCreated());

        User user = userRepository.findByEmail("delivery@deliv.com").orElseThrow();
        DeliveryDriver deliveryDriver = (DeliveryDriver) user;
    }


}
