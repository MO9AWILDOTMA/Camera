package ma.cinecamera.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ma.cinecamera.service.IStatsService;

@RestController
@RequestMapping("/api/moderator/stats")
public class StatsController {

    @Autowired
    private IStatsService service;

    @GetMapping("/reservations")
    public ResponseEntity<?> getReservationStats() {
	return ResponseEntity.ok(service.getReservationStats());
    }

    @GetMapping("/showtimes")
    public ResponseEntity<?> getShowtimeStats() {
	return ResponseEntity.ok(service.getShowtimeStats());
    }

    @GetMapping("/revenues")
    public ResponseEntity<?> getRevenuesStats() {
	return ResponseEntity.ok(service.getRevenues());
    }
}
