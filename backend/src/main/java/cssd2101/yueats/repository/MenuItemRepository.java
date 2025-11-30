package cssd2101.yueats.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import cssd2101.yueats.model.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem,Long> {

}
