package ma.cinecamera.service.impl;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ma.cinecamera.dto.resp.AnalyticsData;
import ma.cinecamera.dto.resp.OccupancyData;
import ma.cinecamera.dto.resp.RevenueData;
import ma.cinecamera.dto.resp.SalesData;
import ma.cinecamera.dto.resp.TopMovie;
import ma.cinecamera.model.Movie;
import ma.cinecamera.model.Reservation;
import ma.cinecamera.model.Showtime;
import ma.cinecamera.model.enums.PaymentStatus;
import ma.cinecamera.model.enums.ReservationStatus;
import ma.cinecamera.repository.PaymentRepository;
import ma.cinecamera.repository.ReservationRepository;
import ma.cinecamera.repository.ShowtimeRepository;
import ma.cinecamera.service.IAnalyticsService;
import ma.cinecamera.utils.DateValue;

@Service
public class AnalyticsService implements IAnalyticsService {

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Override
    public AnalyticsData getAnalyticsData(Integer days) {
	// Calculate sales data
	SalesData salesData = getSalesData(days);

	// Calculate revenue data
	RevenueData revenueData = getRevenueData(days);

	// Calculate occupancy data
	OccupancyData occupancyData = getOccupancyData(days);

	// Get top movies
	List<TopMovie> topMovies = getTopMovies(days);

	return AnalyticsData.builder().sales(salesData).revenue(revenueData).occupancy(occupancyData)
		.topMovies(topMovies).build();
    }

    private SalesData getSalesData(Integer days) {
	// Get current period sales
	Long currentSales = reservationRepository.countByStatusAndCreatedAtBetween(ReservationStatus.CONFIRMED,
		getStartOfCurrentPeriod(days), getEndOfCurrentPeriod());

	// Get previous period sales
	Long previousSales = reservationRepository.countByStatusAndCreatedAtBetween(ReservationStatus.CONFIRMED,
		getStartOfPreviousPeriod(days), getEndOfPreviousPeriod(days));

	// Calculate change percentage
	double change = calculateChangePercentage(previousSales, currentSales);

	// Get sales over time data
	List<DateValue> salesOverTime = reservationRepository.findDailySales(ReservationStatus.CONFIRMED,
		getStartOfCurrentPeriod(days), getEndOfCurrentPeriod());

	return SalesData.builder().total(currentSales).change(change).data(salesOverTime).build();
    }

    private RevenueData getRevenueData(Integer days) {
	// Get current period revenue
	Double currentRevenue = paymentRepository.sumAmountByStatusAndCreatedAtBetween(PaymentStatus.CONFIRMED,
		getStartOfCurrentPeriod(days), getEndOfCurrentPeriod()).orElse(0.0);

	// Get previous period revenue
	Double previousRevenue = paymentRepository.sumAmountByStatusAndCreatedAtBetween(PaymentStatus.CONFIRMED,
		getStartOfPreviousPeriod(days), getEndOfPreviousPeriod(days)).orElse(0.0);

	// Calculate change percentage
	double change = calculateChangePercentage(previousRevenue, currentRevenue);

	// Get revenue over time data
	List<DateValue> revenueOverTime = paymentRepository.findDailyRevenue(PaymentStatus.CONFIRMED,
		getStartOfCurrentPeriod(days), getEndOfCurrentPeriod());

	return RevenueData.builder().total(currentRevenue).change(change).data(revenueOverTime).build();
    }

    private OccupancyData getOccupancyData(Integer days) {
	// Get current period average occupancy
	Double currentOccupancy = showtimeRepository
		.averageOccupancy(ReservationStatus.CONFIRMED, getStartOfCurrentPeriod(days), getEndOfCurrentPeriod())
		.orElse(0.0);

	// Get previous period average occupancy
	Double previousOccupancy = showtimeRepository.averageOccupancy(ReservationStatus.CONFIRMED,
		getStartOfPreviousPeriod(days), getEndOfPreviousPeriod(days)).orElse(0.0);

	// Calculate change percentage
	double change = calculateChangePercentage(previousOccupancy, currentOccupancy);

	// Get occupancy over time data
	List<DateValue> occupancyOverTime = findDailyOccupancy(ReservationStatus.CONFIRMED,
		getStartOfCurrentPeriod(days), getEndOfCurrentPeriod());

	return OccupancyData.builder().average(currentOccupancy).change(change).data(occupancyOverTime).build();
    }

    private List<TopMovie> getTopMovies(Integer days) {
	List<Object[]> results = reservationRepository
		.findTop5MostReservedMoviesWithRevenue(ReservationStatus.CONFIRMED);

	return results.stream().map(result -> {
	    Movie movie = (Movie) result[0];
	    Long tickets = ((Number) result[1]).longValue();
	    Double revenue = ((Number) result[2]).doubleValue();

	    return TopMovie.builder().title(movie.getName()).tickets(tickets).revenue(revenue).build();
	}).collect(Collectors.toList());
    }

    private double calculateChangePercentage(double previous, double current) {
	if (previous == 0) {
	    return current == 0 ? 0 : 100;
	}
	return ((current - previous) / previous) * 100;
    }

    private LocalDateTime getStartOfCurrentPeriod(Integer days) {
	if (days == null || days <= 0) {
	    days = 30; // default to 30 days if invalid input
	}
	return LocalDateTime.now().minusDays(days);
    }

    private LocalDateTime getEndOfCurrentPeriod() {
	return LocalDateTime.now();
    }

    private LocalDateTime getStartOfPreviousPeriod(Integer days) {
	if (days == null || days <= 0) {
	    days = 30; // default to 30 days if invalid input
	}
	return LocalDateTime.now().minusDays(days * 2); // previous period should be same length
    }

    private LocalDateTime getEndOfPreviousPeriod(Integer days) {
	return getStartOfCurrentPeriod(days).minusSeconds(1);
    }

    private List<DateValue> findDailyOccupancy(ReservationStatus status, LocalDateTime start, LocalDateTime end) {
	List<Reservation> reservations = reservationRepository.findByStatusAndShowtimeDateTimeBetween(status, start,
		end);

	return reservations.stream().collect(Collectors.groupingBy(r -> r.getShowtime().getDateTime().toLocalDate(),
		Collectors.averagingDouble(r -> {
		    Showtime s = r.getShowtime();
		    return (double) r.getSeats().length / s.getTotalSeats();
		}))).entrySet().stream().map(e -> new DateValue() {
		    @Override
		    public String getDate() {
			return e.getKey().toString();
		    }

		    @Override
		    public Double getValue() {
			return e.getValue();
		    }
		}).sorted(Comparator.comparing(DateValue::getDate)).collect(Collectors.toList());
    }
}
