package cssd2101.yueats.integration;


import com.fasterxml.jackson.databind.ObjectMapper;
import cssd2101.yueats.dto.*;
import cssd2101.yueats.model.*;
import cssd2101.yueats.repository.MenuItemRepository;
import cssd2101.yueats.repository.OrderRepository;
import cssd2101.yueats.repository.RestaurantRepository;
import cssd2101.yueats.repository.UserRepository;
import cssd2101.yueats.scheduler.OrderStateMachine;
import cssd2101.yueats.service.OrderService;
import cssd2101.yueats.types.OrderStatus;
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

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
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

    @Autowired
    private OrderStateMachine orderStateMachine;

    private DeliveryDriver driver;
    private Order order;

    private User customer;
    private Restaurant restaurant;

    private MenuItem pizza;
    private MenuItem rings;

    @BeforeEach
    void setup() throws Exception {
        CustomerSignupRequest driverDto = new CustomerSignupRequest("driver@testing.com", "Driver", "Tester", "1234567890",
                "Password123!");

        mockMvc.perform(post("/drivers").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(driverDto)))
                .andExpect(status().isCreated());

        User user = userRepository.findByEmail("driver@testing.com").orElseThrow();
        driver = (DeliveryDriver) user;

        // 1. Create Vendor
        VendorSignupRequest vendorDto = new VendorSignupRequest("vendor@testvend.com",
                "vendor", "owner", "1234567890", "Password123!", "BurgerKing");

        mockMvc.perform(post("/vendors")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(vendorDto)))
                .andExpect(status().isCreated());

        User vendorUser = userRepository.findByEmail("vendor@testvend.com").orElseThrow();
        Vendor vendor = (Vendor) vendorUser;

        // 2. Create Restaurant
        RestaurantCreationRequest restDto = new RestaurantCreationRequest("Pizza Pizza", vendor.getId(), "123 Pizza St");
        mockMvc.perform(post("/restaurants")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(restDto)))
                .andExpect(status().isCreated());

        restaurant = restaurantRepository.findByRestaurantName("Pizza Pizza").orElseThrow();

        MenuItemCreationRequest item1 = new MenuItemCreationRequest("Pizza", "Cheese Pizza", 10.00);
        mockMvc.perform(post("/restaurants/{id}/menu-item", restaurant.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(item1)))
                .andExpect(status().isCreated());

        MenuItemCreationRequest item2 = new MenuItemCreationRequest("Onion Rings", "Salty onion rings", 5.00);
        mockMvc.perform(post("/restaurants/{id}/menu-item", restaurant.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(item2)))
                .andExpect(status().isCreated());

        // Fetch items from DB to get their IDs
        List<MenuItem> items = menuItemRepository.findAll();
        pizza = items.stream().filter(i -> i.getItemName().equals("Pizza")).findFirst().orElseThrow();
        rings = items.stream().filter(i -> i.getItemName().equals("Onion Rings")).findFirst().orElseThrow();

        // 4. Create Customer
        CustomerSignupRequest customerDto = new CustomerSignupRequest("bobsmith@customer.com", "Bob", "Smith", "3945739284", "Password123!");
        mockMvc.perform(post("/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(customerDto)))
                .andExpect(status().isCreated());

        customer = userRepository.findByEmail("bobsmith@customer.com").orElseThrow();
    }

    @Test
    void testOrderProgression() throws Exception {
        OrderItemRequest orderItem1 = new OrderItemRequest(pizza.getId(), 2);
        OrderItemRequest orderItem2 = new OrderItemRequest(rings.getId(), 1);

        OrderCreationRequest orderDto = new OrderCreationRequest(
                customer.getId(),
                restaurant.getId(),
                "Bob smith Home Address",
                List.of(orderItem1, orderItem2)
        );

        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderDto)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.totalPrice").value(25.00))
                .andExpect(jsonPath("$.deliveryAddress").value("Bob smith Home Address"));

        List<Order> orders = orderRepository.findByCustomerId(customer.getId());
        Order order1 = orders.get(0);

        Assertions.assertEquals(OrderStatus.PENDING, order1.getStatus());

        orderStateMachine.updateOrderStatus(order1);
        Order updated1 = orderRepository.findById(Long.valueOf(order1.getId())).orElseThrow();

        Assertions.assertEquals(OrderStatus.PREPARING, updated1.getStatus());

        orderStateMachine.updateOrderStatus(updated1);
        Order updated2 = orderRepository.findById(Long.valueOf(order1.getId())).orElseThrow();
        Assertions.assertEquals(OrderStatus.READY_FOR_PICKUP, updated2.getStatus());
        Assertions.assertNotNull(updated2.getPickupCode());
    }



    @Test
    void testReadyOrders() throws Exception {
        OrderItemRequest orderItem1 = new OrderItemRequest(pizza.getId(), 2);
        OrderItemRequest orderItem2 = new OrderItemRequest(rings.getId(), 1);

        OrderCreationRequest orderDto = new OrderCreationRequest(
                customer.getId(),
                restaurant.getId(),
                "Bob smith Home Address",
                List.of(orderItem1, orderItem2)
        );

        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderDto)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.totalPrice").value(25.00))
                .andExpect(jsonPath("$.deliveryAddress").value("Bob smith Home Address"));

        OrderItemRequest orderItem3 = new OrderItemRequest(pizza.getId(), 1);
        OrderItemRequest orderItem4 = new OrderItemRequest(rings.getId(), 2);

        OrderCreationRequest orderDto2 = new OrderCreationRequest(
                customer.getId(),
                restaurant.getId(),
                "Bob smith Home Address",
                List.of(orderItem3, orderItem4)
        );

        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderDto2)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"));

        OrderItemRequest orderItem5 = new OrderItemRequest(pizza.getId(), 1);
        OrderItemRequest orderItem6 = new OrderItemRequest(rings.getId(), 2);

        OrderCreationRequest orderDto3 = new OrderCreationRequest(
                customer.getId(),
                restaurant.getId(),
                "Bob smith Home Address",
                List.of(orderItem5, orderItem6)
        );

        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderDto3)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"));


        List<Order> orders = orderRepository.findByStatus(OrderStatus.PENDING);
        for (Order order: orders) {
            orderStateMachine.updateOrderStatus(order);
            orderStateMachine.updateOrderStatus(order);
        }

        mockMvc.perform(get("/drivers/orders/available").with(user(driver.getEmail()).roles("COURIER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3));
    }


}
