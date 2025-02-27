package ma.cinecamera.model.enums;

public enum ERole {
    ROLE_ADMIN, ROLE_CINEPHILE, ROLE_MODERATOR;

    // Helper method to get the role name
    public String getRoleName() {
	return this.name();
    }
}
