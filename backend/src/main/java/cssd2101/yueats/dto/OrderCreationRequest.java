package cssd2101.yueats.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record OrderCreationRequest(
        @NotNull(message="Customer ID is required")
        Integer customerId,
        @NotNull(message="Restaurant ID is required")
        Integer restaurantId,
        @NotBlank
        @NotNull(message = "Delivery address is required")
        String deliveryAddress,
        @NotEmpty
        @NotNull(message="Order must contain items")
        List<OrderItemRequest> items
) {
}
