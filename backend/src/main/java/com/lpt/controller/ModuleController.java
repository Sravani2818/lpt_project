package com.lpt.controller;

import com.lpt.entity.LearningModuleEntity;
import com.lpt.entity.ModuleSubmissionEntity;
import com.lpt.service.ModuleService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class ModuleController {
    private final ModuleService moduleService;

    public ModuleController(ModuleService moduleService) {
        this.moduleService = moduleService;
    }

    @GetMapping("/courses/{courseId}/modules")
    public Map<String, Object> modules(@PathVariable Integer courseId) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("modules", moduleService.listByCourse(courseId));
        return response;
    }

    @GetMapping("/modules/{moduleId}")
    public Map<String, Object> module(@PathVariable Integer moduleId) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("module", moduleService.get(moduleId));
        return response;
    }

    @PostMapping("/modules")
    @PreAuthorize("hasRole('ADMIN')")
    public LearningModuleEntity create(@RequestBody Map<String, Object> body) {
        return moduleService.save(body);
    }

    @PutMapping("/modules/{moduleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public LearningModuleEntity update(@PathVariable Integer moduleId, @RequestBody Map<String, Object> body) {
        body.put("moduleId", moduleId);
        return moduleService.save(body);
    }

    @DeleteMapping("/modules/{moduleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer moduleId) {
        moduleService.delete(moduleId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/modules/{moduleId}/submit")
    public Map<String, Object> submit(
            @PathVariable Integer moduleId,
            @RequestParam Integer userId,
            @RequestParam("file") MultipartFile file) throws Exception {
        return moduleService.submitPdf(userId, moduleId, file);
    }

    @GetMapping("/submissions")
    public List<ModuleSubmissionEntity> submissions(
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) Integer courseId,
            @RequestParam(required = false) Integer moduleId) {
        return moduleService.listSubmissions(userId, courseId, moduleId);
    }

    @PutMapping("/submissions/{submissionId}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ModuleSubmissionEntity review(@PathVariable Integer submissionId, @RequestBody Map<String, Object> body) {
        return moduleService.review(submissionId, body);
    }

    @GetMapping("/submissions/{submissionId}/download")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> download(@PathVariable Integer submissionId) throws Exception {
        ModuleSubmissionEntity submission = moduleService.listSubmissions(null, null, null).stream()
                .filter(s -> s.getSubmissionId().equals(submissionId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));
        Resource resource = new UrlResource(java.nio.file.Path.of(submission.getFilePath()).toUri());
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"submission-" + submissionId + ".pdf\"")
                .body(resource);
    }
}
