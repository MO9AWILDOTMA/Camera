package ma.cinecamera.controller;

import java.io.IOException;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import ma.cinecamera.dto.req.MovieReqDto;
import ma.cinecamera.service.IMovieService;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class MovieController {
    @Autowired
    private IMovieService service;

    @Secured("ROLE_CINEPHILE")
    @GetMapping("/user/movies")
    public ResponseEntity<?> index(@RequestParam(defaultValue = "1", name = "page") Integer page,
	    @RequestParam(defaultValue = "3", name = "size") Integer size) {
	return ResponseEntity.ok(service.getAllMovies(page, size));
    }

    @Secured("ROLE_MODERATOR")
    @PostMapping(value = "/moderator/movies", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> store(@ModelAttribute @Valid MovieReqDto dto) throws IOException {
	return ResponseEntity.ok(service.createMovie(dto));
    }

}
