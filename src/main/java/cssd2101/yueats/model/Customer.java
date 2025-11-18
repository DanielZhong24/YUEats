package cssd2101.yueats.model;


import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;


@Entity
@DiscriminatorValue("CUSTOMER")
public class Customer extends User {

    @Column(nullable = true)
    private String studentNumber;




}
