package ma.cinecamera.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ListResponse {
    private Object content;
    private Long totalElements;
    private Integer totalPages;
}
