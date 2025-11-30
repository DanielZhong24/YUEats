package cssd2101.yueats.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@DiscriminatorValue("CUSTOMER")
@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
public class Customer extends User {

}
