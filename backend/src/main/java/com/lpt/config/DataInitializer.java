package com.lpt.config;

import com.lpt.entity.CategoryEntity;
import com.lpt.entity.CourseEntity;
import com.lpt.entity.MenuEntity;
import com.lpt.entity.ProgressEntity;
import com.lpt.entity.ProgressStatus;
import com.lpt.entity.RoleEntity;
import com.lpt.entity.RolesMappingEntity;
import com.lpt.entity.UserEntity;
import com.lpt.repository.CategoryRepository;
import com.lpt.repository.CourseRepository;
import com.lpt.repository.MenuRepository;
import com.lpt.repository.ProgressRepository;
import com.lpt.repository.RoleRepository;
import com.lpt.repository.RolesMappingRepository;
import com.lpt.repository.UserRepository;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final ProgressRepository progressRepository;
    private final MenuRepository menuRepository;
    private final RolesMappingRepository rolesMappingRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            RoleRepository roleRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            CourseRepository courseRepository,
            ProgressRepository progressRepository,
            MenuRepository menuRepository,
            RolesMappingRepository rolesMappingRepository,
            PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.courseRepository = courseRepository;
        this.progressRepository = progressRepository;
        this.menuRepository = menuRepository;
        this.rolesMappingRepository = rolesMappingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (roleRepository.count() > 0) {
            log.info("Database already seeded — skipping DataInitializer");
            return;
        }
        log.info("Seeding LPT database...");
        seedRoles();
        seedUsers();
        seedCategories();
        seedCourses();
        seedProgress();
        seedMenuAndMappings();
        log.info("Seed complete — demo logins: admin@lpt.com / learner@lpt.com");
    }

    private void seedRoles() {
        saveRole((short) 1, "Learner");
        saveRole((short) 3, "Admin");
    }

    private void saveRole(short id, String name) {
        var r = new RoleEntity();
        r.setRole(id);
        r.setRolename(name);
        roleRepository.save(r);
    }

    private void seedUsers() {
        saveUser("admin@lpt.com", "admin123", "Admin User", "9999999999", (short) 3);
        saveUser("learner@lpt.com", "learner123", "Priya Sharma", "9876543210", (short) 1);
        saveUser("alex@lpt.com", "learner123", "Alex Kumar", "9988776655", (short) 1);
    }

    private void saveUser(String email, String password, String name, String phone, short role) {
        var u = new UserEntity();
        u.setEmailId(email);
        u.setPasswordHash(passwordEncoder.encode(password));
        u.setFullname(name);
        u.setPhone(phone);
        u.setRole(role);
        u.setStatus((short) 1);
        userRepository.save(u);
    }

    private void seedCategories() {
        String[] names = {
            "Python", "Data Science", "Web Development", "Java", "Artificial Intelligence", "Cloud Computing"
        };
        for (String n : names) {
            var c = new CategoryEntity();
            c.setCategoryName(n);
            categoryRepository.save(c);
        }
    }

    private void seedCourses() {
        saveCourse("Python Basics", "Learn Python from scratch", 20, 1);
        saveCourse("Java Spring Boot", "Build REST APIs with Spring Boot", 30, 4);
        saveCourse("Machine Learning", "Intro to ML algorithms", 40, 2);
        saveCourse("Cloud with AWS", "AWS fundamentals and services", 25, 6);
        saveCourse("React Frontend", "Build modern UIs with React", 20, 3);
    }

    private void saveCourse(String name, String desc, int hours, int categoryId) {
        var c = new CourseEntity();
        c.setCourseName(name);
        c.setDescription(desc);
        c.setDurationHours(hours);
        c.setCategoryId(categoryId);
        c.setStatus((short) 1);
        courseRepository.save(c);
    }

    private void seedProgress() {
        saveProgress(2, 1, ProgressStatus.COMPLETED, 100, 92, "2026-05-20T14:30:00");
        saveProgress(2, 3, ProgressStatus.IN_PROGRESS, 65, 78, "2026-05-24T09:15:00");
        saveProgress(2, 5, ProgressStatus.IN_PROGRESS, 40, 71, "2026-05-23T18:45:00");
        saveProgress(2, 4, ProgressStatus.NOT_STARTED, 0, 0, "2026-05-18T10:00:00");
        saveProgress(4, 1, ProgressStatus.IN_PROGRESS, 55, 68, "2026-05-22T11:20:00");
        saveProgress(4, 2, ProgressStatus.NOT_STARTED, 0, 0, "2026-05-19T08:00:00");
        saveProgress(4, 5, ProgressStatus.COMPLETED, 100, 88, "2026-05-21T16:00:00");
    }

    private void seedMenuAndMappings() {
        String[][] menus = {
            {"1", "Dashboard", "dashboard"},
            {"2", "My Courses", "book-open"},
            {"3", "My Progress", "trending-up"},
            {"4", "Course Manager", "layers"},
            {"5", "User Manager", "users"},
            {"6", "Reports", "bar-chart-3"},
            {"7", "My Profile", "user-circle"}
        };
        for (String[] m : menus) {
            var menu = new MenuEntity();
            menu.setMid(Integer.parseInt(m[0]));
            menu.setMenu(m[1]);
            menu.setIcon(m[2]);
            menuRepository.save(menu);
        }
        int[][] mappings = {
            {1, 1}, {2, 1}, {3, 1}, {7, 1},
            {1, 3}, {2, 3}, {3, 3}, {4, 3}, {5, 3}, {6, 3}, {7, 3}
        };
        for (int[] map : mappings) {
            var rm = new RolesMappingEntity();
            rm.setMid(map[0]);
            rm.setRole((short) map[1]);
            rolesMappingRepository.save(rm);
        }
    }

    private void saveProgress(
            int userId, int courseId, ProgressStatus status, int pct, int score, String updated) {
        var p = new ProgressEntity();
        p.setUserId(userId);
        p.setCourseId(courseId);
        p.setStatus(status);
        p.setCompletionPct(pct);
        p.setScore(score);
        p.setLastUpdated(LocalDateTime.parse(updated));
        progressRepository.save(p);
    }
}
