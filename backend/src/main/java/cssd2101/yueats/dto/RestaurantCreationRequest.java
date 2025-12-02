package cssd2101.yueats.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

public record RestaurantCreationRequest(
        @NotBlank(message = "Restaurant name is mandatory")
        @Size(max=50, message = "Restaurant must be 50 characters or less")
        String restaurantName,

        @NotBlank(message = "Owner ID is mandatory")
        Integer ownerId,

        @NotBlank(message = "Address is mandatory")
        String address
)
{}