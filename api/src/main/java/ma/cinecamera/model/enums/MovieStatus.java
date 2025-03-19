package ma.cinecamera.model.enums;

public enum MovieStatus {
    NOW_SHOWING("Now Showing"), COMING_SOON("Coming Soon"), PREMIERES_FRIDAY("Premieres Friday"),
    SPECIAL_SCREENING("Special Screening"), LIMITED_RELEASE("Limited Release"),
    EXCLUSIVE_PREMIERE("Exclusive Premiere"), BACK_BY_POPULAR_DEMAND("Back By Popular Demand"),
    ADVANCE_BOOKING("Advance Booking"), PREVIEW_SCREENING("Preview Screening"), FINAL_WEEK("Final Week");

    private final String displayName;

    MovieStatus(String displayName) {
	this.displayName = displayName;
    }

    public String getDisplayName() {
	return displayName;
    }
}
