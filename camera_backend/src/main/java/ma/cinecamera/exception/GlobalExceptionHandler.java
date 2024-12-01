package ma.cinecamera.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(value = { ModelNotFoundException.class })
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public ExceptionMessage ModelNotFoundExceptionHandler(ModelNotFoundException ex) {
		return new ExceptionMessage(HttpStatus.NOT_FOUND, HttpStatus.NOT_FOUND.value(), ex.getMessage());
	}
}
