package cssd2101.yueats.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import cssd2101.yueats.dto.*;
import cssd2101.yueats.model.*;
import cssd2101.yueats.repository.*;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
@TestPropertySource(properties = "spring.sql.init.mode=never")
@Import(TestConfig.class)
public class OrderControllerTest {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RestaurantRepository restaurantRepository;
    @Autowired
    private MenuItemRepository menuItemRepository;
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private User customer;
    private Restaurant restaurant;
    private MenuItem burger;
    private MenuItem fries;

    @BeforeEach
    void setup() throws Exception {
        // 1. Create Vendor
        VendorSignupRequest vendorDto = new VendorSignupRequest("vendor@order.com",
                "vendor", "owner", "1234567890", "Password123!", "BurgerKing");

        mockMvc.perform(post("/vendors")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(vendorDto)))
                .andExpect(status().isCreated());

        User vendorUser = userRepository.findByEmail("vendor@order.com").orElseThrow();
        Vendor vendor = (Vendor) vendorUser;

        // 2. Create Restaurant
        RestaurantCreationRequest restDto = new RestaurantCreationRequest("Burger King", vendor.getId(), "123 King St");
        mockMvc.perform(post("/restaurants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(restDto)))
                .andExpect(status().isCreated());

        restaurant = restaurantRepository.findByRestaurantName("Burger King").orElseThrow();

        // 3. Create Menu Items (Burger $10, Fries $5)
        // Assuming your endpoint is /restaurants/{id}/menu-item based on previous context
        MenuItemCreationRequest item1 = new MenuItemCreationRequest("Burger", "Cheeseburger", 10.00);
        mockMvc.perform(post("/restaurants/{id}/menu-item", restaurant.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(item1)))
                .andExpect(status().isCreated());

        MenuItemCreationRequest item2 = new MenuItemCreationRequest("Fries", "Salty fries", 5.00);
        mockMvc.perform(post("/restaurants/{id}/menu-item", restaurant.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(item2)))
                .andExpect(status().isCreated());

        // Fetch items from DB to get their IDs
        List<MenuItem> items = menuItemRepository.findAll();
        burger = items.stream().filter(i -> i.getItemName().equals("Burger")).findFirst().orElseThrow();
        fries = items.stream().filter(i -> i.getItemName().equals("Fries")).findFirst().orElseThrow();

        // 4. Create Customer
        CustomerSignupRequest customerDto = new CustomerSignupRequest("alice@eats.com", "Alice", "Customer", "0987654321", "Password123!");
        mockMvc.perform(post("/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customerDto)))
                .andExpect(status().isCreated());

        customer = userRepository.findByEmail("alice@eats.com").orElseThrow();
    }

    @Test
    void createOrderSuccess() throws Exception {
        // Alice orders: 2 Burgers ($10 * 2) + 1 Fries ($5 * 1) = $25.00 Total
        OrderItemRequest orderItem1 = new OrderItemRequest(burger.getId(), 2);
        OrderItemRequest orderItem2 = new OrderItemRequest(fries.getId(), 1);

        OrderCreationRequest orderDto = new OrderCreationRequest(
                customer.getId(),
                restaurant.getId(),
                "Alice Home Address",
                List.of(orderItem1, orderItem2)
        );

        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.totalPrice").value(25.00))
                .andExpect(jsonPath("$.deliveryAddress").value("Alice Home Address"));

        // Verify Database State
        List<Order> orders = orderRepository.findByCustomerId(customer.getId());
        Assertions.assertEquals(1, orders.size());

        Order savedOrder = orders.get(0);
        Assertions.assertEquals(2, savedOrder.getOrderDetails().size());
        // Verify precise math
        Assertions.assertEquals(0, new BigDecimal("25.00").compareTo(savedOrder.getTotalPrice()));
    }

    @Test
    void createOrderFailValidation() throws Exception {
        // Test Missing Address
        OrderItemRequest item = new OrderItemRequest(burger.getId(), 1);
        OrderCreationRequest dto = new OrderCreationRequest(
                customer.getId(),
                restaurant.getId(),
                "", // Blank address
                List.of(item)
        );

        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.deliveryAddress").value("must not be blank"));

        // Test Empty Items
        OrderCreationRequest dto2 = new OrderCreationRequest(
                customer.getId(),
                restaurant.getId(),
                "Address",
                List.of() // Empty list
        );

        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto2)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.items").value("must not be empty"));

        Assertions.assertEquals(0, orderRepository.count());
    }

    @Test
    void createOrderFailWrongRestaurant() throws Exception {
        // 1. Create a second Vendor & Restaurant
        VendorSignupRequest vendor2Dto = new VendorSignupRequest("vendor2@order.com",
                "vendorTwo", "owner", "1234567890", "Password123!", "TacoBell");
        mockMvc.perform(post("/vendors").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(vendor2Dto)));
        Vendor vendor2 = (Vendor) userRepository.findByEmail("vendor2@order.com").orElseThrow();

        RestaurantCreationRequest rest2Dto = new RestaurantCreationRequest("Taco Bell", vendor2.getId(), "456 Taco St");
        mockMvc.perform(post("/restaurants").contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(rest2Dto)));

        Restaurant tacoBell = restaurantRepository.findByRestaurantName("Taco Bell").orElseThrow();

        // 2. Add Item to Taco Bell
        MenuItemCreationRequest tacoDto = new MenuItemCreationRequest("Taco", "Crunchy", 2.00);
        mockMvc.perform(post("/restaurants/{id}/menu-item", tacoBell.getId())
                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(tacoDto)));

        MenuItem taco = menuItemRepository.findAll().stream().filter(i -> i.getItemName().equals("Taco")).findFirst().orElseThrow();

        // 3. Try to order a Taco (from Taco Bell) at Burger King (current 'restaurant')
        OrderItemRequest sneakyItem = new OrderItemRequest(taco.getId(), 1);
        OrderCreationRequest sneakyOrder = new OrderCreationRequest(
                customer.getId(),
                restaurant.getId(), // Ordering at Burger King
                "Address",
                List.of(sneakyItem) // requesting Taco Bell item
        );

        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sneakyOrder)))
                .andExpect(status().isBadRequest())
                // Assuming your service throws RuntimeException which is caught and returns the message
                .andExpect(content().string(org.hamcrest.Matchers.containsString("not from this restaurant")));

        Assertions.assertEquals(0, orderRepository.count());
    }

    @Test
    void createOrderFailCustomerNotFound() throws Exception {
        OrderItemRequest item = new OrderItemRequest(burger.getId(), 1);
        OrderCreationRequest dto = new OrderCreationRequest(
                9999, // Fake ID
                restaurant.getId(),
                "Address",
                List.of(item)
        );

        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                // Based on your 'createRestaurantNoUser' test which expects error string
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Customer not found")));
    }
}