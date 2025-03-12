package ma.cinecamera.exception;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class ExceptionMessage {
    private String error;
    private String message;
    private Integer status;
    private LocalDate time;
}
