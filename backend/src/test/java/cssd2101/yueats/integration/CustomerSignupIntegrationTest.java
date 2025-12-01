package cssd2101.yueats.integration;

import cssd2101.yueats.dto.CustomerSignupRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CustomerSignupIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCustomerSignupEndToEnd() throws Exception {
        CustomerSignupRequest dto = new CustomerSignupRequest(
                "testuser@example.com",
                "Test",
                "User",
                "1234567890",
                "Password123!"
        );

        mockMvc.perform(post("/customers/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("testuser@example.com"))
                .andExpect(jsonPath("$.userRole").value("CUSTOMER"))
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    void testCustomerSignupEndToEndFail() throws Exception {
        CustomerSignupRequest dto = new CustomerSignupRequest(
                "testinguser@",
                "TestTwo",
                "UserTwo",
                "1234567890",
                "Password123!"
        );

        mockMvc.perform(post("/customers/signup").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto))).
                andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.email").value("Invalid email format"));
    }

    @Test
    void testCustomerSignupInvalidName() throws Exception {
        CustomerSignupRequest dto = new CustomerSignupRequest(
                "testinguser@test.com",
                "Test2",
                "User2",
                "1234567890",
                "Password123!"
        );

        mockMvc.perform(post("/customers/signup").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.firstName").value("First name cannot contain numbers"))
                .andExpect(jsonPath("$.lastName").value("Last name cannot contain numbers"));
    }

    @Test
    void testCustomerSignupInvalidLastName() throws Exception {
        CustomerSignupRequest dto = new CustomerSignupRequest(
                "testing@user.com",
                "Tester",
                "User",
                "1234sdfhasdfasdfasdf",
                "Password123!"
        );

        mockMvc.perform(post("/customers/signup").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.phoneNumber").value("Phone number must only contain 10 digits"));
    }

    @Test
    void testCustomerSignupInvalidPassword() throws Exception {
        CustomerSignupRequest dto = new CustomerSignupRequest(
                "testing@test2.com",
                "TesterTwo",
                "UserTwo",
                "1234567890",
                "password123"
        );

        mockMvc.perform(post("/customers/signup").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.passwordHash")
                        .value("Password must be between 8 and 32 characters, contain at least one number, " +
                                "one lowercase letter, one uppercase letter, " +
                                "and one special character"));
    }

    @Test
    void testCustomerSignupInvalidPassword2() throws Exception {
        CustomerSignupRequest dto = new CustomerSignupRequest(
                "testing@test2.com",
                "TesterTwo",
                "UserTwo",
                "1234567890",
                "test123"
        );

        mockMvc.perform(post("/customers/signup").contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.passwordHash")
                        .value("Password must be between 8 and 32 characters, contain at least one number, " +
                                "one lowercase letter, one uppercase letter, " +
                                "and one special character"));
    }


    @Test
    void testCustomerSignupAllBlank() throws Exception {
        CustomerSignupRequest dto = new CustomerSignupRequest(
                "",
                "",
                "",
                "",
                ""

        );

        mockMvc.perform(post("/customers/signup").contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.email").value("Email is mandatory"))
                .andExpect(jsonPath("$.firstName").value("First name cannot be blank"))
                .andExpect(jsonPath("$.lastName").value("Last name cannot be blank"))
                .andExpect(jsonPath("$.phoneNumber").value("Phone number must only contain 10 digits"))
                .andExpect(jsonPath("$.passwordHash").value("Password must be between 8 and 32 characters, contain at least one number, " +
                        "one lowercase letter, one uppercase letter, " +
                        "and one special character"));
    }


}
