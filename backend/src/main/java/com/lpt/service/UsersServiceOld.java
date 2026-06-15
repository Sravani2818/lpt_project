package com.lpt.service;

import com.lpt.dto.SigninSchema;
import com.lpt.dto.SignupSchema;
import com.lpt.dto.UsersUpsertSchema;
import com.lpt.entity.MenuEntity;
import com.lpt.entity.UserEntity;
import com.lpt.security.JwtService;
import com.lpt.repository.MenuRepository;
import com.lpt.repository.UserRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import io.jsonwebtoken.Claims;

@Service
public class UsersServiceOld {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final MenuRepository menuRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final GemService gemService;
    private final StreakService streakService;

    public UsersServiceOld(
            UserRepository userRepository,
            JwtService jwtService,
            MenuRepository menuRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            GemService gemService,
            StreakService streakService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.menuRepository = menuRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.gemService = gemService;
        this.streakService = streakService;
    }

    public Map<String, Object> signinService(SigninSchema req) {
        Map<String, Object> response = new HashMap<>();
        try {
            UserEntity user = userRepository
                    .findByEmailId(req.username())
                    .orElseThrow(() -> new BadCredentialsException("Authentication Failed"));

            if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
                throw new BadCredentialsException("Authentication Failed");
            }
            if (user.getStatus() != 1) {
                throw new BadCredentialsException("Authentication Failed");
            }

            String token = jwtService.generateToken(user.getId(), user.getRole(), user.getEmailId());
            streakService.updateStreak(user.getId());
            response.put("code", 200);
            response.put("jwt", token);
            return response;
        } catch (Exception e) {
            response.put("code", 501);
            response.put("message", "Authentication Failed");
            return response;
        }
    }

    @Transactional
    public Map<String, Object> signupService(SignupSchema req) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (req.email() == null || !req.email().toLowerCase().endsWith("@gmail.com")) {
                response.put("code", 400);
                response.put("message", "Only @gmail.com emails are allowed");
                return response;
            }
            boolean exists = userRepository.existsByEmailId(req.email());
            if (exists) {
                response.put("code", 501);
                response.put("message", "user already exist");
                return response;
            }

            UserEntity u = new UserEntity();
            u.setEmailId(req.email());
            u.setFullname(req.fullname());
            u.setPhone(req.phone());
            u.setRole((short) 1);
            u.setStatus((short) 1);
            u.setPasswordHash(passwordEncoder.encode(req.password()));
            UserEntity saved = userRepository.save(u);
            gemService.awardGems(saved.getId(), 50, "Welcome bonus! 🎉");
            emailService.sendWelcomeEmail(saved.getEmailId(), saved.getFullname());

            response.put("code", 200);
            response.put("message", "User Registered Successfully");
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }

    public Map<String, Object> uinfo(String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            Claims claims = jwtService.parseClaims(token);
            String email = claims.get("email", String.class);
            Short role = jwtService.getRole(claims);
            UserEntity user = userRepository.findByEmailId(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            List<MenuEntity> menulist = menuRepository.findMenusByRole(role);

            response.put("code", 200);
            response.put("fullname", user.getFullname());
            response.put("menulist", menulist);
            response.putAll(streakService.getStreakInfo(user.getId()));
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }

    public Map<String, Object> profile(String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            Claims claims = jwtService.parseClaims(token);
            String email = claims.get("email", String.class);
            UserEntity user = userRepository.findByEmailId(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            response.put("code", 200);
            response.put("user", user);
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }

    public Map<String, Object> getAllUsers(int page, int limit, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            Claims claims = jwtService.parseClaims(token);
            Short role = jwtService.getRole(claims);
            if (role != null && role != 3) {
                response.put("code", 403);
                response.put("message", "Admin only");
                return response;
            }

            Pageable pageable = PageRequest.of(page - 1, limit);
            Page<UserEntity> users = userRepository.findAll(pageable);
            response.put("code", 200);
            response.put("page", page);
            response.put("size", limit);
            response.put("totalpages", users.getTotalPages());
            response.put("users", users.getContent());
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }

    public Map<String, Object> getUserById(int id, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            Claims claims = jwtService.parseClaims(token);
            Short role = jwtService.getRole(claims);
            if (role != null && role != 3) {
                response.put("code", 403);
                response.put("message", "Admin only");
                return response;
            }

            UserEntity user = userRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("User Not Found"));
            response.put("code", 200);
            response.put("user", user);
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }

    @Transactional
    public Map<String, Object> saveUser(UsersUpsertSchema req, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            Claims claims = jwtService.parseClaims(token);
            Short role = jwtService.getRole(claims);
            if (role != null && role != 3) {
                response.put("code", 403);
                response.put("message", "Admin only");
                return response;
            }

            UserEntity u = new UserEntity();
            u.setEmailId(req.email());
            u.setFullname(req.fullname());
            u.setPhone(req.phone());
            u.setPasswordHash(passwordEncoder.encode(req.password()));
            u.setRole((short) 1);
            u.setStatus((short) 1);
            userRepository.save(u);

            response.put("code", 200);
            response.put("message", "Saved successfully");
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }

    @Transactional
    public Map<String, Object> updateUser(int id, UsersUpsertSchema req, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            Claims claims = jwtService.parseClaims(token);
            Short role = jwtService.getRole(claims);
            if (role != null && role != 3) {
                response.put("code", 403);
                response.put("message", "Admin only");
                return response;
            }

            UserEntity user = userRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("User not exist"));
            user.setEmailId(req.email());
            user.setFullname(req.fullname());
            user.setPhone(req.phone());
            user.setPasswordHash(passwordEncoder.encode(req.password()));
            userRepository.save(user);

            response.put("code", 200);
            response.put("message", "Updated successfully");
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }

    @Transactional
    public Map<String, Object> deleteUser(int id, String token) {
        Map<String, Object> response = new HashMap<>();
        try {
            Claims claims = jwtService.parseClaims(token);
            Short role = jwtService.getRole(claims);
            if (role != null && role != 3) {
                response.put("code", 403);
                response.put("message", "Admin only");
                return response;
            }

            UserEntity user = userRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("User not exist"));
            userRepository.deleteById(id);
            response.put("code", 200);
            response.put("message", "Deleted successfully");
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
}

