package cssd2101.yueats.repository;

import cssd2101.yueats.model.Customer;
import cssd2101.yueats.model.User;
import org.springframework.data.repository.CrudRepository;


public interface UserRepository extends CrudRepository<User,Long> {

}
