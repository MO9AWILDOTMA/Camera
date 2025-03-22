package ma.cinecamera.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ma.cinecamera.dto.req.ShowtimeReqDto;
import ma.cinecamera.service.IShowtimeService;

@RestController
@RequestMapping("/api")
public class ShowtimeController {
    @Autowired
    private IShowtimeService service;

    @GetMapping("/user/showtimes")
    public ResponseEntity<?> index(@RequestParam(defaultValue = "1", name = "page") Integer page,
	    @RequestParam(defaultValue = "3", name = "size") Integer size) {
	return ResponseEntity.ok(service.getAllShowtimes(page, size));
    }

    @GetMapping("/user/showtimes/{slug}")
    public ResponseEntity<?> show(@PathVariable(name = "slug") String slug) {
	return ResponseEntity.ok(service.getShowtimeDetail(slug));
    }

    @Secured("ROLE_MODERATOR")
    @PostMapping(value = "/moderator/showtimes")
    public ResponseEntity<?> store(@RequestBody @Valid List<ShowtimeReqDto> dtos) {
	return ResponseEntity.ok(service.createShowtimes(dtos));
    }

    @Secured("ROLE_MODERATOR")
    @PutMapping(value = "/moderator/showtimes/{id}")
    public ResponseEntity<?> update(@RequestBody @Valid ShowtimeReqDto dto, @PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.updateShowtime(id, dto));
    }

    @Secured("ROLE_MODERATOR")
    @DeleteMapping("/moderator/showtimes/{id}")
    public ResponseEntity<?> delete(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.deleteShowtime(id));
    }
}
