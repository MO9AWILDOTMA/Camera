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

import ma.cinecamera.dto.req.DiscountReqDto;
import ma.cinecamera.service.IDiscountService;

@RestController
@RequestMapping("/api")
public class DiscountController {

    @Autowired
    private IDiscountService service;

    @Secured("ROLE_MODERATOR")
    @GetMapping("/moderator/discounts")
    public ResponseEntity<?> index(@RequestParam(defaultValue = "1", name = "page") Integer page,
	    @RequestParam(defaultValue = "3", name = "size") Integer size) {
	return ResponseEntity.ok(service.getAll(page, size));
    }

    @Secured("ROLE_MODERATOR")
    @GetMapping("/moderator/discounts/{id}")
    public ResponseEntity<?> show(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.getDetail(id));
    }

    @Secured("ROLE_MODERATOR")
    @PostMapping("/moderator/discounts")
    public ResponseEntity<?> store(@RequestBody @Valid DiscountReqDto dto) {
	return ResponseEntity.ok(service.create(dto));
    }

    @Secured("ROLE_MODERATOR")
    @PutMapping("/moderator/discounts/{id}")
    public ResponseEntity<?> update(@PathVariable(name = "id") Long id, @RequestBody @Valid DiscountReqDto dto) {
	return ResponseEntity.ok(service.update(id, dto));
    }

    @Secured("ROLE_MODERATOR")
    @DeleteMapping("/moderator/discounts/{id}")
    public ResponseEntity<?> delete(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.delete(id));
    }
}
