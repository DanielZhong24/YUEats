package cssd2101.yueats.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CustomerSignupRequest(

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email is mandatory")
        String email,

        @Size(max=50, message="First name must be 50 characters or less")
        @NotBlank(message = "First name cannot be blank")
        @Pattern(regexp = "^[^0-9]*$", message = "First name cannot contain numbers")
        String firstName,

        @Size(max=50, message = "Last name must be 50 characters or less")
        @NotBlank(message = "Last name cannot be blank")
        @Pattern(regexp = "^[^0-9]*$", message = "Last name cannot contain numbers")
        String lastName,

        @Pattern(regexp = "\\d{10}", message = "Phone number must only contain 10 digits")
        String phoneNumber,

        @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=()])(?=\\S+$).{8,32}$", message = "Password must be between 8 and 32 characters, contain at least one number, " +
                "one lowercase letter, one uppercase letter, " +
                "and one special character")
        String password
){}
