package cssd2101.yueats.model;


import cssd2101.yueats.types.UserRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="user_role",discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
@Table(name="app_user")
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Integer id;

    @Column(unique = true)
    private String email;

    @Column(nullable=false)
    private String passwordHash;
    private String firstName;
    private String lastName;
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name="user_role",nullable = false,updatable = false,insertable = false)
    private UserRole userRole;
}
