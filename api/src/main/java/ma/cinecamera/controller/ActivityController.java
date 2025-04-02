package ma.cinecamera.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ma.cinecamera.service.IActivityService;

@RestController
@RequestMapping("/api")
public class ActivityController {
    @Autowired
    private IActivityService service;

    @Secured("ROLE_MODERATOR")
    @GetMapping("/moderator/activities")
    public ResponseEntity<?> index(@RequestParam(defaultValue = "1", name = "page") Integer page,
	    @RequestParam(defaultValue = "3", name = "size") Integer size) {
	return ResponseEntity.ok(service.getAll(page, size));
    }

    @Secured("ROLE_CINEPHILE")
    @GetMapping("/cinephile/activities/{id}")
    public ResponseEntity<?> myActivities(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.getMyActivities(id));
    }
}
