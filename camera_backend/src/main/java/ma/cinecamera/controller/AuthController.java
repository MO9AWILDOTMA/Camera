package ma.cinecamera.controller;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ma.cinecamera.dto.req.LoginDto;
import ma.cinecamera.dto.req.UserReqDto;
import ma.cinecamera.dto.resp.GlobalResp;
import ma.cinecamera.service.IAuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private IAuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid UserReqDto user) {
	return ResponseEntity.ok(authService.registerHandler(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginDto body, HttpServletResponse resp) {
	return ResponseEntity.ok(authService.loginHandler(body, resp));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse resp) {
	GlobalResp message = authService.logoutHandler(resp);
	return ResponseEntity.ok(message);
    }
}