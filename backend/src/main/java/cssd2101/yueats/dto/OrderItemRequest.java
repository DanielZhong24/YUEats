package cssd2101.yueats.dto;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record OrderItemRequest(
        @NotNull(message="Menu item ID is required")
        Integer menuItemId,

        @Positive(message="Quantity must be greater than 0")
        Integer quantity
) {
}
