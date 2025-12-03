package cssd2101.yueats.validation;

import cssd2101.yueats.repository.RestaurantRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

/*
public class RestaurantUniqueValidator implements ConstraintValidator<Unique, String> {

    @Autowired
    private RestaurantRepository restaurantRepository;


    @Override
    public boolean isValid(String restaurantName, ConstraintValidatorContext context) {
        if (restaurantName == null || restaurantName.isEmpty()) {
            return true;
        }

        return !restaurantRepository.existsByName(restaurantName);
    }
}
 */
