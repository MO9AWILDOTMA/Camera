package ma.cinecamera.exception;

import org.springframework.http.HttpStatus;

public class ExceptionMessage {

	private HttpStatus httpStatus;
	private Integer status;
	private String messgae;

	public ExceptionMessage(HttpStatus httpStatus, Integer status, String message) {
		this.httpStatus = httpStatus;
		this.status = status;
		this.messgae = message;
	}

}
