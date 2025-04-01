package ma.cinecamera.controller;

import java.io.IOException;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import ma.cinecamera.dto.req.MovieReqDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.service.IMovieService;
import ma.cinecamera.service.IShowtimeService;

@RestController
@RequestMapping("/api")
public class MovieController {
    @Autowired
    private IMovieService service;

    @Autowired
    private IShowtimeService showtimeService;

    @GetMapping("/user/movies")
    public ResponseEntity<?> index(@RequestParam(defaultValue = "1", name = "page") Integer page,
	    @RequestParam(defaultValue = "3", name = "size") Integer size) {
	return ResponseEntity.ok(service.getAllMovies(page, size));
    }

    @GetMapping("/user/movies/showtimes/{id}")
    public ResponseEntity<?> getShowtimes(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(showtimeService.getMovieShowtimes(id));
    }

    @GetMapping("/user/movies/upcoming")
    public ResponseEntity<?> get(@RequestParam(defaultValue = "1", name = "page") Integer page,
	    @RequestParam(defaultValue = "3", name = "size") Integer size) {
	return ResponseEntity.ok(service.currentAndUpcomingmovies(page, size));
    }

    @GetMapping("/user/movies/{slug}")
    public ResponseEntity<?> show(@PathVariable(name = "slug") String slug) {
	return ResponseEntity.ok(service.getMovieDetail(slug));
    }

    @Secured("ROLE_MODERATOR")
    @PostMapping(value = "/moderator/movies", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> store(@ModelAttribute @Valid MovieReqDto dto) throws IOException {
	return ResponseEntity.ok(service.createMovie(dto));
    }

    @Secured("ROLE_MODERATOR")
    @PutMapping(value = "/moderator/movies/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(@ModelAttribute @Valid MovieReqDto dto, @PathVariable(name = "id") Long id)
	    throws IOException {
	return ResponseEntity.ok(service.updateMovie(id, dto));
    }

    @Secured("ROLE_MODERATOR")
    @DeleteMapping("/moderator/movies/{id}")
    public ResponseEntity<?> delete(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.deleteMovie(id));
    }

    @GetMapping("/user/movies/search/{query}")
    public ResponseEntity<?> search(@PathVariable(name = "query") String query,
	    @RequestParam(defaultValue = "All", name = "genre") String genre,
	    @RequestParam(defaultValue = "1", name = "page") Integer page,
	    @RequestParam(defaultValue = "3", name = "size") Integer size) {
	return ResponseEntity.ok(service.search(query, genre, page, size));
    }

    @Secured("ROLE_MODERATOR")
    @PostMapping("/moderator/movies/uploadTrailer/{movieId}")
    public ResponseEntity<GlobalResp> uploadTrailer(@PathVariable Long movieId,
	    @RequestParam("file") MultipartFile file) {
	return service.uploadMovieTrailer(file, movieId);
    }

    @GetMapping("user/movies/streamTrailer/{movieId}")
    public ResponseEntity<ResourceRegion> streamTrailer(@PathVariable Long movieId,
	    @RequestHeader HttpHeaders headers) {
	return service.streamMovieTrailer(movieId, headers);
    }
}
