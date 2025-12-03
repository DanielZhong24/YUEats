package cssd2101.yueats.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@SuperBuilder
@Getter
@Setter
@Table(name="restaurants")
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Integer id;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private Vendor owner;

    @Column(nullable = false, unique = true)

    private String restaurantName;

    @Column(nullable = false)
    private String address;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<MenuItem> menuItems = new ArrayList<MenuItem>();

}
