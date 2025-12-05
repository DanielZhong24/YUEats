package cssd2101.yueats.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("VENDOR")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Vendor extends User{
    @Column(name="business_name",unique = true, length = 100)
    private String businessName;


    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Restaurant> ownedRestaurants = new ArrayList<>();

    public List<Restaurant> getOwnedRestaurants() {
        if (ownedRestaurants == null) {
            ownedRestaurants = new ArrayList<>();
        }
        return ownedRestaurants;
    }

    public void addRestaurant(Restaurant restaurant) {
        getOwnedRestaurants().add(restaurant);
        restaurant.setOwner(this);
    }
}

