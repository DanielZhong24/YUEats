package cssd2101.yueats.dto;
// import cssd2101.yueats.validation.Unique;
import cssd2101.yueats.validation.NotBlankCheck;
import cssd2101.yueats.validation.SizeCheck;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.groups.Default;

public record RestaurantCreationRequest(
        @NotBlank(groups = NotBlankCheck.class, message = "Restaurant name is mandatory")
        @Size(groups = SizeCheck.class, max=50, message = "Restaurant must be 50 characters or less")
        String restaurantName,

        @NotNull(groups = Default.class, message = "Owner ID is mandatory")
        Integer ownerId,

        @NotBlank(groups = Default.class, message = "Address is mandatory")
        String address,

        @NotBlank(groups=NotBlank.class, message = "Image url cannot be empty")
        String bannerImgUrl
)
{}