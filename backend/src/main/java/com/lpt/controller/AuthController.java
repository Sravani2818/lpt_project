package com.lpt.controller;

import com.lpt.dto.AuthResponse;
import com.lpt.dto.LoginRequest;
import com.lpt.dto.UserDto;
import com.lpt.service.AuthService;
import com.lpt.service.UserService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody Map<String, Object> body) {
        String email = stringValue(body.getOrDefault("email_id", body.get("email")));
        String password = stringValue(body.getOrDefault("password", body.get("password_hash")));
        String fullname = stringValue(body.getOrDefault("fullname", body.getOrDefault("username", email)));
        String phone = stringValue(body.getOrDefault("phone", ""));
        Short role = parseRole(body.get("role"));
        return ResponseEntity.ok(userService.create(email, password, fullname, phone, role));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(authService.me(user.getUsername()));
    }

    private static String stringValue(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    private static Short parseRole(Object rawRole) {
        if (rawRole instanceof Number number) {
            return number.shortValue() == 3 ? (short) 3 : (short) 1;
        }
        String role = stringValue(rawRole);
        return "ADMIN".equalsIgnoreCase(role) || "3".equals(role) ? (short) 3 : (short) 1;
    }
}
