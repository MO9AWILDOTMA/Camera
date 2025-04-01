package ma.cinecamera.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ma.cinecamera.service.ISeatService;

@RestController
@RequestMapping("/api")
public class SeatController {

    @Autowired
    private ISeatService service;

    @Secured("ROLE_MODERATOR")
    @GetMapping("/cinephile/seats/check/{id}")
    public ResponseEntity<?> availabilityChecker(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.checkAvaibality(id));
    }
}
