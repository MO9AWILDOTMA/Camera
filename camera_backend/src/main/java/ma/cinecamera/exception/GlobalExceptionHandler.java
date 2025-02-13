package ma.cinecamera.exception;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ExceptionMessage resourceNotFoundExceptionHandler(ResourceNotFoundException exception) {
	ExceptionMessage message = ExceptionMessage.builder().error(HttpStatus.NOT_FOUND.toString())
		.message(exception.getMessage()).status(HttpStatus.NOT_FOUND.value()).time(LocalDate.now()).build();
	return message;
    }

    @ExceptionHandler(SearchTypeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ExceptionMessage searchTypeExceptionHandler(SearchTypeException exception) {
	ExceptionMessage message = ExceptionMessage.builder().error(HttpStatus.BAD_REQUEST.toString())
		.message(exception.getMessage()).status(HttpStatus.BAD_REQUEST.value()).time(LocalDate.now()).build();
	return message;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ExceptionMessage illegalArgumentExceptionHandler(IllegalArgumentException exception) {
	ExceptionMessage message = ExceptionMessage.builder().error(HttpStatus.BAD_REQUEST.toString())
		.message(exception.getMessage()).status(HttpStatus.BAD_REQUEST.value()).time(LocalDate.now()).build();
	return message;
    }

    @ExceptionHandler(ResourceValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ExceptionMessage ResourceValidationExceptionHandler(ResourceValidationException exception) {
	ExceptionMessage message = ExceptionMessage.builder().error(HttpStatus.BAD_REQUEST.toString())
		.message(exception.getMessage()).status(HttpStatus.BAD_REQUEST.value()).time(LocalDate.now()).build();
	return message;
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ExceptionMessage ResourceValidationExceptionHandler(HttpMessageNotReadableException exception) {
	ExceptionMessage message = ExceptionMessage.builder().error(HttpStatus.BAD_REQUEST.toString())
		.message(exception.getMessage()).status(HttpStatus.BAD_REQUEST.value()).time(LocalDate.now()).build();
	return message;
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ExceptionMessage RuntimeExceptionHandler(RuntimeException exception) {
	ExceptionMessage message = ExceptionMessage.builder().error(HttpStatus.INTERNAL_SERVER_ERROR.toString())
		.message(exception.getMessage()).status(HttpStatus.INTERNAL_SERVER_ERROR.value()).time(LocalDate.now())
		.build();
	return message;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ValidationErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {

	ValidationErrorResponse errors = new ValidationErrorResponse();
	errors.setTimestamp(LocalDateTime.now());
	errors.setStatus(HttpStatus.BAD_REQUEST.value());
	errors.setMessage("Validation Failed");

	ex.getBindingResult().getFieldErrors().forEach(error -> {
	    errors.addError(error.getField(), error.getDefaultMessage());
	});

	return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(CustomDuplicateKeyException.class)
    public ResponseEntity<?> handleDuplicateKeyException(CustomDuplicateKeyException ex) {
	return ResponseEntity.status(HttpStatus.CONFLICT).body("A record with this username already exists");
    }

    @ExceptionHandler(HttpMediaTypeNotAcceptableException.class)
    public ExceptionMessage handleHttpMediaTypeNotAcceptableException(HttpMediaTypeNotAcceptableException ex) {
	ExceptionMessage message = ExceptionMessage.builder().error(HttpStatus.NOT_ACCEPTABLE.toString())
		.message(ex.getMessage()).status(HttpStatus.NOT_ACCEPTABLE.value()).time(LocalDate.now()).build();
	return message;
    }

    @ExceptionHandler(IOException.class)
    public ExceptionMessage handleFileRetrieving(IOException ex) {
	return new ExceptionMessage("File Access Error", ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value(),
		LocalDate.now());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ExceptionMessage handleFileRetrieving(IllegalStateException ex) {
	return new ExceptionMessage("File Access Error", ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value(),
		LocalDate.now());
    }
}
