package ma.cinecamera.exception;

public class ResourceNotFoundException extends RuntimeException {
    private String message;

    public ResourceNotFoundException() {
	super();
    }

    public ResourceNotFoundException(String msg) {
	super(msg);
	this.message = msg;
    }
}
