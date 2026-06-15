package com.lpt.controller;

import com.lpt.dto.CourseDto;
import com.lpt.dto.CourseRequest;
import com.lpt.security.UserPrincipal;
import com.lpt.service.CourseService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public List<CourseDto> list() {
        return courseService.findAll();
    }

    @GetMapping("/{id}")
    public CourseDto get(@PathVariable Integer id) {
        return courseService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<CourseDto> create(
            @Valid @RequestBody CourseRequest request, @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(courseService.create(request, principal.getUser().getId()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public CourseDto update(@PathVariable Integer id, @Valid @RequestBody CourseRequest request) {
        return courseService.update(id, request);
    }

    @PutMapping("/{id}/toggle-status")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public CourseDto toggleStatus(@PathVariable Integer id) {
        return courseService.toggleStatus(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
