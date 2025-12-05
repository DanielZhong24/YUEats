package cssd2101.yueats.dto;

import cssd2101.yueats.model.Restaurant;
import cssd2101.yueats.validation.NotBlankCheck;
import cssd2101.yueats.validation.SizeCheck;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.groups.Default;

public record MenuItemCreationRequest(

        @NotBlank(groups= NotBlankCheck.class, message = "Name is mandatory")
        @Size(groups= SizeCheck.class, min = 3, max = 30, message = "Name must be between 3 and 30 characters")
        String itemName,

        @NotBlank(groups= NotBlankCheck.class, message = "Description cannot be empty")
        @Size(groups = SizeCheck.class, min = 5, max=255, message = "Description must be between 5 and 255 characters")
        String description,

        @NotNull(groups = Default.class, message = "Price is mandatory")
        Double price

) {}