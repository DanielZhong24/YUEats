package cssd2101.yueats.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@Builder
@Table(name = "menu_items", uniqueConstraints = @UniqueConstraint(columnNames = { "restaurant_id", "item_name" }))
@NoArgsConstructor
@AllArgsConstructor
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "img_url")
    private String imgUrl;

    @Builder.Default
    @Column(nullable = false)
    private boolean isAvailable = true;

    @Column(nullable = false)
    private String category;
}
