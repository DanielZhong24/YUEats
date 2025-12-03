package cssd2101.yueats.dto;

import cssd2101.yueats.model.Restaurant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MenuItemCreationRequest(

        @NotBlank(message = "Name is mandatory")
        @Size(min = 3, max = 30, message = "Name must be between 3 and 30 characters")
        String itemName,

        @NotNull(message = "Restaurant cannot be empty")
        Restaurant restaurant,

        @NotBlank(message = "Description cannot be empty")
        @Size(max=255, message = "Description must be 255 characters or less")
        String description,

        @NotNull(message = "Price is mandatory")
        Double price

) {}