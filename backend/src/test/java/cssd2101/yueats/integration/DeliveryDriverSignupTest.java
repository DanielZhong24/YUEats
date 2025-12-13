package cssd2101.yueats.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import cssd2101.yueats.dto.CustomerSignupRequest;
import cssd2101.yueats.model.DeliveryDriver;
import cssd2101.yueats.model.User;
import cssd2101.yueats.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.junit.jupiter.api.Assertions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import cssd2101.yueats.types.UserRole;

@SpringBootTest
@AutoConfigureMockMvc
@Import(TestConfig.class)
public class DeliveryDriverSignupTest {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // pretty much the same as customer signup but role is different

    @Test
    void testDeliveryDriverSignup() throws Exception{
        CustomerSignupRequest dto = new CustomerSignupRequest("delivery@deliv.com", "Delivery", "guy",
                "1234567890", "Password123!");

        mockMvc.perform(post("/drivers").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated());

        User user = userRepository.findByEmail("delivery@deliv.com").orElseThrow();
        DeliveryDriver deliveryDriver = (DeliveryDriver) user;

        Assertions.assertEquals(UserRole.COURIER, deliveryDriver.getUserRole());

    }

    @Test
    void testDeliveryDriverFail() throws Exception{
        CustomerSignupRequest dto = new CustomerSignupRequest("deliv.com", "", "", "12343", "234rsd");

        mockMvc.perform(post("/drivers").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.email").value("Invalid email format"))
                .andExpect(jsonPath("$.firstName").value("First name cannot be blank"))
                .andExpect(jsonPath("$.lastName").value("Last name cannot be blank"))
                .andExpect(jsonPath("$.password").value("Password must be between 8 and 32 characters, " +
                        "contain at least one number, one lowercase letter, " +
                        "one uppercase letter, and one special character"))
                .andExpect(jsonPath("$.phoneNumber").value("Phone number must only contain 10 digits"));
    }
}
