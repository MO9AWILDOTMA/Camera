package ma.cinecamera.controller;

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

import ma.cinecamera.dto.req.ReservationReqDto;
import ma.cinecamera.dto.req.ReservationUpdateDto;
import ma.cinecamera.service.IReservationService;

@RestController
@RequestMapping("/api")
public class ReservationController {

    @Autowired
    private IReservationService service;

    @Secured("ROLE_MODERATOR")
    @GetMapping("/moderator/reservations")
    public ResponseEntity<?> index(@RequestParam(defaultValue = "1", name = "page") Integer page,
	    @RequestParam(defaultValue = "3", name = "size") Integer size) {
	return ResponseEntity.ok(service.getAll(page, size));
    }

    @Secured("ROLE_CINEPHINLE")
    @PostMapping("/cinephile/reservations")
    public ResponseEntity<?> store(@RequestBody @Valid ReservationReqDto dto) {
	return ResponseEntity.ok(service.create(dto));
    }

    @Secured("ROLE_MODERATOR")
    @PutMapping("/moderator/reservations/{id}")
    public ResponseEntity<?> update(@PathVariable(name = "id") Long id, @RequestBody @Valid ReservationUpdateDto dto) {
	return ResponseEntity.ok(service.update(id, dto));
    }

    @Secured("ROLE_CINEPHINLE")
    @PutMapping("/cinephile/reservations/cancel/{id}")
    public ResponseEntity<?> cancelReservation(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.cancelReservation(id));
    }

    @Secured("ROLE_MODERATOR")
    @DeleteMapping("/moderator/reservations/{id}")
    public ResponseEntity<?> delete(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.delete(id));
    }

    @Secured("ROLE_MODERATOR")
    @PutMapping("/moderator/reservations/archive/{id}")
    public ResponseEntity<?> archive(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.archive(id));
    }

}
