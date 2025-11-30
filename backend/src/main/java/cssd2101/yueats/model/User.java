package cssd2101.yueats.model;


import cssd2101.yueats.types.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="user_role",discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
@Table(name="app_user")
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Integer id;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is mandatory")
    @Column(unique = true)
    private String email;

    @Column(nullable=false)
    @NotBlank(message = "Password is mandatory")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=()])(?=\\S+$).{8,32}$", message = "Password must be between 8 and 32 characters, contain at least one number, " +
            "one lowercase letter, one uppercase letter, " +
            "and one special character")
    private String passwordHash;

    @Column(name="first_name", nullable=false, length=50)
    @Size(max=50, message="First name must be 50 characters or less")
    @NotBlank(message = "First name cannot be blank")
    @Pattern(regexp = "^[^0-9]*$", message = "First name cannot contain numbers")
    private String firstName;

    @Column(name="last_name", nullable=false, length=50)
    @Size(max=50, message = "Last name must be 50 characters or less")
    @NotBlank(message = "Last name cannot be blank")
    @Pattern(regexp = "^[^0-9]*$", message = "Last name cannot contain numbers")
    private String lastName;

    @Column(name = "phone_number")
    @Pattern(regexp = "\\d{10}", message = "Phone number must only contain 10 digits")
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name="user_role",nullable = false,updatable = false,insertable = false)
    private UserRole userRole;
}
