package ma.cinecamera.utils;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import ma.cinecamera.model.Movie;
import ma.cinecamera.model.Showtime;
import ma.cinecamera.model.enums.MovieStatus;

public class MovieStatusManager {
    // Set the threshold for high reservation percentage (e.g., 80%)
    private static final double HIGH_RESERVATION_THRESHOLD = 0.8;

    /**
     * Automatically determines the movie status based on showtimes and reservations
     */
    public static MovieStatus determineStatus(Movie movie) {
	LocalDate today = LocalDate.now();
	List<Showtime> futureShowtimes = movie.getShowtimes().stream()
		.filter(showtime -> showtime.getDateTime().toLocalDate().isAfter(today)).collect(Collectors.toList());

	List<Showtime> currentShowtimes = movie.getShowtimes().stream()
		.filter(showtime -> !showtime.getDateTime().toLocalDate().isAfter(today)).collect(Collectors.toList());

	// No showtimes at all
	if (movie.getShowtimes().isEmpty()) {
	    return MovieStatus.COMING_SOON;
	}

	// Check if all showtimes are in the future
	if (currentShowtimes.isEmpty() && !futureShowtimes.isEmpty()) {
	    // Check if any showtime is this Friday
	    LocalDate nextFriday = getNextFriday(today);
	    boolean premieresFriday = futureShowtimes.stream()
		    .anyMatch(showtime -> showtime.getDateTime().toLocalDate().equals(nextFriday));

	    if (premieresFriday) {
		return MovieStatus.PREMIERES_FRIDAY;
	    }

	    // Check for preview screenings
	    boolean hasPreviewScreenings = futureShowtimes.stream().anyMatch(Showtime::isPreview);

	    if (hasPreviewScreenings) {
		return MovieStatus.PREVIEW_SCREENING;
	    }

	    // Check if advance booking is available
	    LocalDate nextWeek = today.plusDays(7);
	    boolean startsWithinNextWeek = futureShowtimes.stream()
		    .anyMatch(showtime -> !showtime.getDateTime().toLocalDate().isAfter(nextWeek));

	    if (startsWithinNextWeek) {
		return MovieStatus.ADVANCE_BOOKING;
	    }

	    return MovieStatus.COMING_SOON;
	}

	// Check if the movie is currently showing
	if (!currentShowtimes.isEmpty()) {
	    // Check if it's the final week (no showtimes after 7 days)
	    LocalDate oneWeekLater = today.plusDays(7);
	    boolean noShowtimesAfterOneWeek = futureShowtimes.stream()
		    .noneMatch(showtime -> showtime.getDateTime().toLocalDate().isAfter(oneWeekLater));

	    if (noShowtimesAfterOneWeek && !futureShowtimes.isEmpty()) {
		return MovieStatus.FINAL_WEEK;
	    }

	    // Check for special screenings
	    boolean hasSpecialScreenings = currentShowtimes.stream().anyMatch(Showtime::isSpecialEvent);

	    if (hasSpecialScreenings) {
		return MovieStatus.SPECIAL_SCREENING;
	    }

	    // Check if limited release (few showtimes or locations)
	    if (currentShowtimes.size() <= 3) {
		return MovieStatus.LIMITED_RELEASE;
	    }

	    // Check if it's popular (high reservation percentage)
	    double avgReservationPercentage = currentShowtimes.stream().mapToDouble(Showtime::getReservationPercentage)
		    .average().orElse(0.0);

	    if (avgReservationPercentage >= HIGH_RESERVATION_THRESHOLD) {
		return MovieStatus.BACK_BY_POPULAR_DEMAND;
	    }

	    // Default status for movies currently in theaters
	    return MovieStatus.NOW_SHOWING;
	}

	// Fallback status
	return MovieStatus.COMING_SOON;
    }

    /**
     * Gets the date of the next Friday from the given date
     */
    private static LocalDate getNextFriday(LocalDate date) {
	return date.plusDays((12 - date.getDayOfWeek().getValue()) % 7);
    }
}
