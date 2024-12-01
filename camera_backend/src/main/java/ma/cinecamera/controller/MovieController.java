package ma.cinecamera.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import ma.cinecamera.service.IMovieService;

@RestController
@RequestMapping("/api/movies")
@AllArgsConstructor
public class MovieController {
	private IMovieService service;
}
