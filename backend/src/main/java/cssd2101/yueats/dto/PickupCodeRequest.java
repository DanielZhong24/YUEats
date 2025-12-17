package cssd2101.yueats.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PickupCodeRequest(
        @NotBlank
        @NotNull(message = "Code is required")
        String code
) {}