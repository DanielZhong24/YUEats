package cssd2101.yueats.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="restaurants")
@Data
@Builder
@Getter
@Setter
@DiscriminatorValue("RESTAURANT")
@NoArgsConstructor
@AllArgsConstructor

public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Integer id;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private String restaurantName;

    @Column(nullable = false)
    private String address;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<MenuItem> menuItems = new ArrayList<MenuItem>();

}
