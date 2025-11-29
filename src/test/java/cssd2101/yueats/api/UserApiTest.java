package cssd2101.yueats.api;

import io.restassured.RestAssured;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

public class UserApiTest {

    @Test
    void testCustomerSignup() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = 8080;

        String requestBody = """
            {
                "email": "test@example.com",
                "firstName": "John",
                "lastName": "Doe",
                "phoneNumber": "1234567890",
                "password": "password123"
            }
            """;

        given()
                .header("Content-Type", "application/json")
                .body(requestBody)
                .when()
                .post("/customers/signup")
                .then()
                .statusCode(201)
                .body("email", equalTo("test@example.com"))
                .body("userRole", equalTo("CUSTOMER"));
    }
}
