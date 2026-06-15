package com.lpt.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "modules")
public class LearningModuleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "module_id")
    private Integer moduleId;

    @Column(name = "course_id", nullable = false)
    private Integer courseId;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(columnDefinition = "TEXT")
    private String resources;

    @Column(name = "assignment_title", length = 180)
    private String assignmentTitle;

    @Column(name = "assignment_description", columnDefinition = "TEXT")
    private String assignmentDescription;

    @Column(name = "submission_required", nullable = false)
    private Boolean submissionRequired = true;

    public Integer getModuleId() { return moduleId; }
    public void setModuleId(Integer moduleId) { this.moduleId = moduleId; }
    public Integer getCourseId() { return courseId; }
    public void setCourseId(Integer courseId) { this.courseId = courseId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public String getResources() { return resources; }
    public void setResources(String resources) { this.resources = resources; }
    public String getAssignmentTitle() { return assignmentTitle; }
    public void setAssignmentTitle(String assignmentTitle) { this.assignmentTitle = assignmentTitle; }
    public String getAssignmentDescription() { return assignmentDescription; }
    public void setAssignmentDescription(String assignmentDescription) { this.assignmentDescription = assignmentDescription; }
    public Boolean getSubmissionRequired() { return submissionRequired; }
    public void setSubmissionRequired(Boolean submissionRequired) { this.submissionRequired = submissionRequired; }
}
