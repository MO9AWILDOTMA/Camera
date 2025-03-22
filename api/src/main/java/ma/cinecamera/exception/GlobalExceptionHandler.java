package ma.cinecamera.exception;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.logging.Logger;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "ma.cinecamera")
public class GlobalExceptionHandler {

    private final Logger logger = Logger.getLogger(GlobalExceptionHandler.class.getName());

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ValidationErrorResponse> handleMethodArgumentNotValidException(
	    MethodArgumentNotValidException ex) {
	return handleBindingResult(ex.getBindingResult());
    }

    @ExceptionHandler(BindException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ValidationErrorResponse> handleBindException(BindException ex) {
	return handleBindingResult(ex.getBindingResult());
    }

    private ResponseEntity<ValidationErrorResponse> handleBindingResult(BindingResult bindingResult) {
	ValidationErrorResponse errors = new ValidationErrorResponse();
	errors.setTimestamp(LocalDateTime.now());
	errors.setStatus(HttpStatus.BAD_REQUEST.value());
	errors.setMessage("Validation Failed");

	bindingResult.getAllErrors().forEach(error -> {
	    String fieldName = ((FieldError) error).getField();
	    String errorMessage = error.getDefaultMessage();
	    errors.addError(fieldName, errorMessage);
	});

	return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(javax.validation.ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ValidationErrorResponse> handleConstraintViolationException(
	    javax.validation.ConstraintViolationException ex) {
	ValidationErrorResponse errors = new ValidationErrorResponse();
	errors.setTimestamp(LocalDateTime.now());
	errors.setStatus(HttpStatus.BAD_REQUEST.value());
	errors.setMessage("Validation Failed");

	ex.getConstraintViolations().forEach(violation -> {
	    String fieldName = violation.getPropertyPath().toString();
	    String errorMessage = violation.getMessage();
	    errors.addError(fieldName, errorMessage);
	});

	return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<ValidationErrorResponse> handleDataIntegrityViolationException(
	    DataIntegrityViolationException ex) {
	ValidationErrorResponse error = new ValidationErrorResponse();
	error.setTimestamp(LocalDateTime.now());
	error.setStatus(HttpStatus.CONFLICT.value());
	error.setMessage("Data integrity violation");
	error.addError("general", "A record with this value already exists.");

	return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ValidationErrorResponse> resourceNotFoundExceptionHandler(
	    ResourceNotFoundException exception) {
	ValidationErrorResponse error = new ValidationErrorResponse();
	error.setTimestamp(LocalDateTime.now());
	error.setStatus(HttpStatus.NOT_FOUND.value());
	error.setMessage(exception.getMessage());
	return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(SearchTypeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ValidationErrorResponse> searchTypeExceptionHandler(SearchTypeException exception) {
	ValidationErrorResponse error = new ValidationErrorResponse();
	error.setTimestamp(LocalDateTime.now());
	error.setStatus(HttpStatus.BAD_REQUEST.value());
	error.setMessage(exception.getMessage());
	return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ValidationErrorResponse> illegalArgumentExceptionHandler(IllegalArgumentException exception) {
	ValidationErrorResponse error = new ValidationErrorResponse();
	error.setTimestamp(LocalDateTime.now());
	error.setStatus(HttpStatus.BAD_REQUEST.value());
	error.setMessage(exception.getMessage());
	return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(ResourceValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ValidationErrorResponse> handleResourceValidationException(
	    ResourceValidationException exception) {
	ValidationErrorResponse error = new ValidationErrorResponse();
	error.setTimestamp(LocalDateTime.now());
	error.setStatus(HttpStatus.BAD_REQUEST.value());
	error.setMessage(exception.getMessage());
	return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ValidationErrorResponse> handleHttpMessageNotReadableException(
	    HttpMessageNotReadableException exception) {
	ValidationErrorResponse error = new ValidationErrorResponse();
	error.setTimestamp(LocalDateTime.now());
	error.setStatus(HttpStatus.BAD_REQUEST.value());
	error.setMessage(exception.getMessage());
	return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(CustomDuplicateKeyException.class)
    public ResponseEntity<?> handleDuplicateKeyException(CustomDuplicateKeyException ex) {
	return ResponseEntity.status(HttpStatus.CONFLICT).body("A record with this email already exists");
    }

    @ExceptionHandler(HttpMediaTypeNotAcceptableException.class)
    public ResponseEntity<ValidationErrorResponse> handleHttpMediaTypeNotAcceptableException(
	    HttpMediaTypeNotAcceptableException ex) {
	ValidationErrorResponse error = new ValidationErrorResponse();
	error.setTimestamp(LocalDateTime.now());
	error.setStatus(HttpStatus.NOT_ACCEPTABLE.value());
	error.setMessage(ex.getMessage());
	return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(error);
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<ValidationErrorResponse> handleIOException(IOException ex) {
	ValidationErrorResponse error = new ValidationErrorResponse();
	error.setTimestamp(LocalDateTime.now());
	error.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
	error.setMessage("File upload failed: " + ex.getMessage());
	return ResponseEntity.internalServerError().body(error);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ValidationErrorResponse> handleIllegalStateException(IllegalStateException ex) {
	ValidationErrorResponse error = new ValidationErrorResponse();
	error.setTimestamp(LocalDateTime.now());
	error.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
	error.setMessage("Illegal State Error: " + ex.getMessage());
	return ResponseEntity.internalServerError().body(error);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ValidationErrorResponse> handleHttpMediaTypeNotSupportedException(
	    HttpMediaTypeNotSupportedException ex) {
	ValidationErrorResponse error = new ValidationErrorResponse();
	error.setTimestamp(LocalDateTime.now());
	error.setStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE.value());
	error.setMessage("Http Media Type Not Supported Error: " + ex.getMessage());
	return ResponseEntity.internalServerError().body(error);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ValidationErrorResponse> handleGenericException(Exception ex) {
	ValidationErrorResponse error = new ValidationErrorResponse();
	error.setTimestamp(LocalDateTime.now());
	error.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
	error.setMessage("An unexpected error occurred: " + ex.getMessage());
	return ResponseEntity.internalServerError().body(error);
    }
}