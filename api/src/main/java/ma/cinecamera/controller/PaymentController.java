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

import ma.cinecamera.dto.req.PaymentReqDto;
import ma.cinecamera.dto.req.PaymentUpdateDto;
import ma.cinecamera.service.IPaymentService;

@RestController
@RequestMapping("/api")
public class PaymentController {

    @Autowired
    private IPaymentService service;

    @Secured("ROLE_MODERATOR")
    @GetMapping("/moderator/payments")
    public ResponseEntity<?> index(@RequestParam(defaultValue = "1", name = "page") Integer page,
	    @RequestParam(defaultValue = "3", name = "size") Integer size) {
	return ResponseEntity.ok(service.getAll(page, size));
    }

    @Secured("ROLE_CINEPHILE")
    @PostMapping("/cinephile/payments")
    public ResponseEntity<?> store(@RequestBody @Valid PaymentReqDto dto) {
	return ResponseEntity.ok(service.create(dto));
    }

    @Secured("ROLE_MODERATOR")
    @PutMapping("/moderator/payments/{id}")
    public ResponseEntity<?> update(@PathVariable(name = "id") Long id, @RequestBody @Valid PaymentUpdateDto dto) {
	return ResponseEntity.ok(service.update(id, dto));
    }

    @Secured("ROLE_CINEPHILE")
    @PutMapping("/cinephile/payments/cancel/{id}")
    public ResponseEntity<?> cancelPayment(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.cancelPayment(id));
    }

    @Secured("ROLE_MODERATOR")
    @DeleteMapping("/moderator/payments/{id}")
    public ResponseEntity<?> delete(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.delete(id));
    }

    @Secured("ROLE_MODERATOR")
    @PutMapping("/moderator/payments/archive/{id}")
    public ResponseEntity<?> archive(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.archive(id));
    }

    @Secured("ROLE_CINEPHILE")
    @GetMapping("/cinephile/payments/{id}")
    public ResponseEntity<?> getMyPayments(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.getMyPayments(id));
    }

}
