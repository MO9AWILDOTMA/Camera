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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ma.cinecamera.dto.req.ProfileUpdateReq;
import ma.cinecamera.dto.req.RolesDto;
import ma.cinecamera.service.IUserService;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private IUserService service;

    @Secured("ROLE_ADMIN")
    @GetMapping("/admin/users")
    public ResponseEntity<?> index(@RequestParam(defaultValue = "1", name = "page") Integer page,
	    @RequestParam(defaultValue = "3", name = "size") Integer size) {
	return ResponseEntity.ok(service.getAll(page, size));
    }

    @Secured("ROLE_ADMIN")
    @GetMapping("/admin/users/{id}")
    public ResponseEntity<?> show(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.getDetail(id));
    }

    @Secured("ROLE_ADMIN")
    @PutMapping(value = "/admin/users/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(@ModelAttribute @Valid ProfileUpdateReq dto, @PathVariable(name = "id") Long id)
	    throws IOException {
	return ResponseEntity.ok(service.update(id, dto));
    }

    @Secured("ROLE_ADMIN")
    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<?> delete(@PathVariable(name = "id") Long id) {
	return ResponseEntity.ok(service.delete(id));
    }

    @Secured("ROLE_CINEPHILE")
    @GetMapping("/cinephile/myAccount")
    public ResponseEntity<?> showMyAccount() {
	return ResponseEntity.ok(service.getMyAccount());
    }

    @Secured("ROLE_CINEPHILE")
    @PutMapping(value = "/cinephile/users", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateMyAccount(@ModelAttribute @Valid ProfileUpdateReq dto) throws IOException {
	return ResponseEntity.ok(service.updateMyAccount(dto));
    }

    @Secured("ROLE_CINEPHILE")
    @DeleteMapping("/cinephile/users")
    public ResponseEntity<?> deleteMyAccount() {
	return ResponseEntity.ok(service.deleteMyAccount());
    }

    @Secured("ROLE_ADMIN")
    @PutMapping("/admin/users/{id}/roles")
    public ResponseEntity<?> assignRoles(@RequestBody @Valid RolesDto roles, @PathVariable(name = "id") Long id)
	    throws IOException {
	return ResponseEntity.ok(service.assignRoles(id, roles));
    }
}
