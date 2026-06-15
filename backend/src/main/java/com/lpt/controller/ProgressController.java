package com.lpt.controller;

import com.lpt.dto.ProgressDto;
import com.lpt.dto.ProgressRequest;
import com.lpt.dto.ProgressSummaryDto;
import com.lpt.security.UserPrincipal;
import com.lpt.service.ProgressService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping
    public List<ProgressDto> list(
            @RequestParam(required = false) Integer userId,
            @AuthenticationPrincipal UserPrincipal principal) {
        return progressService.findAll(
                userId, principal.getUser().getId(), principal.getUser().getRole());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ProgressDto> all(@AuthenticationPrincipal UserPrincipal principal) {
        return progressService.findAll(null, principal.getUser().getId(), principal.getUser().getRole());
    }

    @GetMapping("/user/{userId}")
    public List<ProgressDto> byUser(@PathVariable Integer userId, @AuthenticationPrincipal UserPrincipal principal) {
        return progressService.findAll(userId, principal.getUser().getId(), principal.getUser().getRole());
    }

    @GetMapping("/{id}")
    public ProgressDto get(@PathVariable Integer id) {
        return progressService.findById(id);
    }

    @GetMapping("/summary/{userId}")
    public ProgressSummaryDto summary(@PathVariable Integer userId, @AuthenticationPrincipal UserPrincipal principal) {
        Short role = principal.getUser().getRole();
        if (role != 3 && role != 2 && !principal.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Cannot view other user's summary");
        }
        return progressService.buildSummary(userId);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ProgressDto> upsert(@Valid @RequestBody ProgressRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(progressService.createOrUpdate(request));
    }

    @PostMapping("/update")
    @PreAuthorize("hasAnyRole('ADMIN', 'LEARNER')")
    public ProgressDto updateFromDashboard(@Valid @RequestBody ProgressRequest request) {
        return progressService.createOrUpdate(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN', 'LEARNER')")
    public ProgressDto update(@PathVariable Integer id, @Valid @RequestBody ProgressRequest request) {
        return progressService.createOrUpdate(request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        progressService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
