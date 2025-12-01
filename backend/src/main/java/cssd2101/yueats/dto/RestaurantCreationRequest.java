package cssd2101.yueats.dto;

import cssd2101.yueats.model.User;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantCreationRequest {
    private Integer id;
    private String restaurantName;
    private User owner;
    private String address;

}