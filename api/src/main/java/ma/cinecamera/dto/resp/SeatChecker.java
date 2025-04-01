package ma.cinecamera.dto.resp;

import org.springframework.data.repository.NoRepositoryBean;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
@NoRepositoryBean
public class SeatChecker {
    Boolean available;
}
