package ma.cinecamera.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import ma.cinecamera.service.IMovieService;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class MovieController {
    @Autowired
    private IMovieService service;

//    @Secured("ROLE_USER")
//    @GetMapping("/user/movies")
//    public ResponseEntity<?> index() {
//	return ResponseEntity.ok("good");
//    }

    @Secured("ROLE_MODERATOR")
    @GetMapping("/moderator/movies")
    public ResponseEntity<?> test() {
	return ResponseEntity.ok("good");
    }

}
