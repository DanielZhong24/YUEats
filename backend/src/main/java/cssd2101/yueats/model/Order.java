package cssd2101.yueats.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import cssd2101.yueats.types.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity
@Table(name="orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order{
    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne
    @JoinColumn(name="user_id",nullable = false)
    private User customer;

    @ManyToOne
    @JoinColumn(name="restaurant_id",nullable = false)
    private Restaurant restaurant;

    private LocalDateTime orderDate;

    private LocalDateTime lastUpdated;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private BigDecimal totalPrice;

    private String deliveryAddress;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private DeliveryDriver driver;

    @Column(length = 10)
    private String pickupCode;


    @OneToMany(mappedBy = "order",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference
    @ToString.Exclude
    private List<OrderDetail> orderDetails = new ArrayList<>();

}
