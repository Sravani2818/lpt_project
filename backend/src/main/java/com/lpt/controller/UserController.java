package com.lpt.controller;

import com.lpt.dto.UserDto;
import com.lpt.service.UserService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public List<UserDto> list() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserDto get(@PathVariable Integer id) {
        return userService.findById(id);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public UserDto updateStatus(@PathVariable Integer id, @RequestBody Map<String, Short> body) {
        return userService.updateStatus(id, body.get("status"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> create(@RequestBody Map<String, Object> body) {
        UserDto created = userService.create(
                (String) body.get("email_id"),
                (String) body.get("password"),
                (String) body.get("fullname"),
                (String) body.get("phone"),
                ((Number) body.get("role")).shortValue());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
