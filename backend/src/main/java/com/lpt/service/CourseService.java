package com.lpt.service;

import com.lpt.dto.CourseDto;
import com.lpt.dto.CourseRequest;
import com.lpt.entity.CourseEntity;
import com.lpt.mapper.EntityMapper;
import com.lpt.repository.CourseRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<CourseDto> findAll() {
        return courseRepository.findAll().stream().map(EntityMapper::toCourseDto).toList();
    }

    public CourseDto findById(Integer id) {
        return courseRepository
                .findById(id)
                .map(EntityMapper::toCourseDto)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + id));
    }

    @Transactional
    public CourseDto create(CourseRequest request, Integer createdBy) {
        var entity = new CourseEntity();
        entity.setCourseName(request.course_name());
        entity.setDescription(request.description());
        entity.setDurationHours(request.duration_hours());
        entity.setCategoryId(request.category_id());
        entity.setCreatedBy(createdBy);
        entity.setStatus((short) 1);
        return EntityMapper.toCourseDto(courseRepository.save(entity));
    }

    @Transactional
    public CourseDto update(Integer id, CourseRequest request) {
        var entity = courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Course not found"));
        entity.setCourseName(request.course_name());
        entity.setDescription(request.description());
        entity.setDurationHours(request.duration_hours());
        entity.setCategoryId(request.category_id());
        return EntityMapper.toCourseDto(courseRepository.save(entity));
    }

    @Transactional
    public CourseDto toggleStatus(Integer id) {
        var entity = courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Course not found"));
        entity.setStatus(entity.getStatus() == 1 ? (short) 0 : (short) 1);
        return EntityMapper.toCourseDto(courseRepository.save(entity));
    }

    @Transactional
    public void delete(Integer id) {
        if (!courseRepository.existsById(id)) {
            throw new IllegalArgumentException("Course not found");
        }
        courseRepository.deleteById(id);
    }
}
