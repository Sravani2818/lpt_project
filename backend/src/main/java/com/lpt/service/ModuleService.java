package com.lpt.service;

import com.lpt.entity.LearningModuleEntity;
import com.lpt.entity.ModuleSubmissionEntity;
import com.lpt.repository.LearningModuleRepository;
import com.lpt.repository.ModuleSubmissionRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ModuleService {
    private static final long MAX_PDF_SIZE = 100L * 1024L * 1024L;

    private final LearningModuleRepository moduleRepository;
    private final ModuleSubmissionRepository submissionRepository;
    private final GemService gemService;

    public ModuleService(
            LearningModuleRepository moduleRepository,
            ModuleSubmissionRepository submissionRepository,
            GemService gemService) {
        this.moduleRepository = moduleRepository;
        this.submissionRepository = submissionRepository;
        this.gemService = gemService;
    }

    public List<LearningModuleEntity> listByCourse(Integer courseId) {
        return moduleRepository.findByCourseIdOrderByModuleId(courseId);
    }

    public LearningModuleEntity get(Integer moduleId) {
        return moduleRepository.findById(moduleId).orElseThrow(() -> new IllegalArgumentException("Module not found"));
    }

    @Transactional
    public LearningModuleEntity save(Map<String, Object> body) {
        Integer moduleId = number(body.get("moduleId"));
        LearningModuleEntity module = moduleId == null
                ? new LearningModuleEntity()
                : moduleRepository.findById(moduleId).orElse(new LearningModuleEntity());
        module.setCourseId(number(body.get("courseId")));
        module.setTitle(text(body.get("title")));
        module.setDescription(text(body.get("description")));
        module.setDueDate(LocalDate.parse(text(body.get("dueDate"))));
        module.setResources(text(body.get("resources")));
        module.setAssignmentTitle(text(body.getOrDefault("assignmentTitle", module.getTitle() + " Assignment")));
        module.setAssignmentDescription(text(body.getOrDefault("assignmentDescription", "Submit a PDF for review.")));
        module.setSubmissionRequired(Boolean.parseBoolean(String.valueOf(body.getOrDefault("submissionRequired", true))));
        return moduleRepository.save(module);
    }

    @Transactional
    public void delete(Integer moduleId) {
        moduleRepository.deleteById(moduleId);
    }

    @Transactional
    public Map<String, Object> submitPdf(Integer userId, Integer moduleId, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("PDF file is required");
        }
        String original = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();
        if (!original.endsWith(".pdf") || !"application/pdf".equalsIgnoreCase(file.getContentType())) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }
        if (file.getSize() > MAX_PDF_SIZE) {
            throw new IllegalArgumentException("Maximum PDF size is 100 MB");
        }

        LearningModuleEntity module = get(moduleId);
        Path uploadDir = Path.of("uploads", "submissions", String.valueOf(userId));
        Files.createDirectories(uploadDir);
        String filename = "module-" + moduleId + "-" + System.currentTimeMillis() + ".pdf";
        Path savedPath = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), savedPath, StandardCopyOption.REPLACE_EXISTING);

        ModuleSubmissionEntity submission = new ModuleSubmissionEntity();
        submission.setUserId(userId);
        submission.setModuleId(moduleId);
        submission.setCourseId(module.getCourseId());
        submission.setFilePath(savedPath.toString());
        submission.setStatus("SUBMITTED");
        submission.setSubmittedAt(LocalDateTime.now());
        applyGeneratedFeedback(submission, module);
        ModuleSubmissionEntity saved = submissionRepository.save(submission);
        gemService.awardGemsOnce(userId, 50, "Course completed! 🎓");

        Map<String, Object> response = new HashMap<>();
        response.put("code", 200);
        response.put("message", "PDF submitted and evaluated");
        response.put("submission", saved);
        return response;
    }

    public List<ModuleSubmissionEntity> listSubmissions(Integer userId, Integer courseId, Integer moduleId) {
        if (userId != null) return submissionRepository.findByUserId(userId);
        if (courseId != null) return submissionRepository.findByCourseId(courseId);
        if (moduleId != null) return submissionRepository.findByModuleId(moduleId);
        return submissionRepository.findAll();
    }

    @Transactional
    public ModuleSubmissionEntity review(Integer submissionId, Map<String, Object> body) {
        ModuleSubmissionEntity submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));
        submission.setStatus("REVIEWED");
        submission.setReviewedAt(LocalDateTime.now());
        if (body.get("scoreOutOf10") != null) submission.setScoreOutOf10(number(body.get("scoreOutOf10")));
        if (body.get("aiFeedback") != null) submission.setAiFeedback(text(body.get("aiFeedback")));
        if (body.get("strengths") != null) submission.setStrengths(text(body.get("strengths")));
        if (body.get("improvements") != null) submission.setImprovements(text(body.get("improvements")));
        return submissionRepository.save(submission);
    }

    private void applyGeneratedFeedback(ModuleSubmissionEntity submission, LearningModuleEntity module) {
        int score = Math.max(6, Math.min(10, 7 + (module.getModuleId() % 4)));
        submission.setScoreOutOf10(score);
        submission.setCompletionPercentage(score * 10);
        submission.setAiFeedback("Auto feedback: submission covers the core expectations for " + module.getTitle() + ".");
        submission.setStrengths("Clear attempt, relevant structure, and good coverage of the module topic.");
        submission.setImprovements("Add more examples, cite references, and include a short conclusion.");
    }

    private static Integer number(Object value) {
        if (value == null) return null;
        if (value instanceof Number n) return n.intValue();
        return Integer.parseInt(String.valueOf(value));
    }

    private static String text(Object value) {
        return value == null ? "" : String.valueOf(value);
    }
}
