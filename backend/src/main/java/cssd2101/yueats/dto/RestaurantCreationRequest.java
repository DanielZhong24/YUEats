package cssd2101.yueats.dto;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantCreationRequest {
    private String restaurantName;
    private Integer ownerId;
    private String address;

}