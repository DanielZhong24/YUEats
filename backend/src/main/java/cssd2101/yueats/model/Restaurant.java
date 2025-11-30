package cssd2101.yueats.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("RESTAURANT")
public class Restaurant extends User{
}
