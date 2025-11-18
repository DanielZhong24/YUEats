package cssd2101.yueats.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;

@DiscriminatorValue("CUSTOMER")
public class Customer extends User {

    @Column(nullable = true)
    private String studentId;


}
