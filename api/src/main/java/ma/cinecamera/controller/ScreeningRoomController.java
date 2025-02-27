package ma.cinecamera.controller;

import java.io.IOException;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ma.cinecamera.dto.req.ScreeningRoomReqDto;
import ma.cinecamera.service.IScreeningRoomService;

@RestController
@RequestMapping("/api")
public class ScreeningRoomController {
    @Autowired
    private IScreeningRoomService service;

    @GetMapping("/user/screeningRooms")
    public ResponseEntity<?> index(@RequestParam(defaultValue = "1", name = "page") Integer page,
	    @RequestParam(defaultValue = "3", name = "size") Integer size) {
	return ResponseEntity.ok(service.getAllScreeningRooms(page, size));
    }

    @GetMapping("/user/screeningRooms/{id}")
    public ResponseEntity<?> show(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.getScreeningRoomDetail(id));
    }

    @Secured("ROLE_MODERATOR")
    @PostMapping(value = "/moderator/screeningRooms", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> store(@ModelAttribute @Valid ScreeningRoomReqDto dto) throws IOException {
	return ResponseEntity.ok(service.createScreeningRoom(dto));
    }

    @Secured("ROLE_MODERATOR")
    @PutMapping(value = "/moderator/screeningRooms/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(@ModelAttribute @Valid ScreeningRoomReqDto dto, @PathVariable(name = "id") Long id)
	    throws IOException {
	return ResponseEntity.ok(service.updateScreeningRoom(id, dto));
    }

    @Secured("ROLE_MODERATOR")
    @DeleteMapping("/moderator/screeningRooms/{id}")
    public ResponseEntity<?> delete(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.deleteScreeningRoom(id));
    }
}
