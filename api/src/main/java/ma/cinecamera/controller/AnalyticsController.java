package ma.cinecamera.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ma.cinecamera.dto.resp.AnalyticsData;
import ma.cinecamera.service.IAnalyticsService;

@RestController
@RequestMapping("/api/moderator/analytics")
public class AnalyticsController {

    @Autowired
    private IAnalyticsService analyticsService;

    @GetMapping
    public ResponseEntity<AnalyticsData> getAnalytics(
	    @RequestParam(required = false, defaultValue = "30") Integer days) {
	return ResponseEntity.ok(analyticsService.getAnalyticsData(days));
    }
}
