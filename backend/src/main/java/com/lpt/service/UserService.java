package com.lpt.service;

import com.lpt.dto.UserDto;
import com.lpt.entity.UserEntity;
import com.lpt.mapper.EntityMapper;
import com.lpt.repository.UserRepository;
import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final GemService gemService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            GemService gemService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.gemService = gemService;
    }

    public List<UserDto> findAll() {
        return userRepository.findAll().stream().map(EntityMapper::toUserDto).toList();
    }

    public UserDto findById(Integer id) {
        return userRepository
                .findById(id)
                .map(EntityMapper::toUserDto)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Transactional
    public UserDto updateStatus(Integer id, Short status) {
        UserEntity user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(status);
        return EntityMapper.toUserDto(userRepository.save(user));
    }

    @Transactional
    public UserDto create(String email, String password, String fullname, String phone, Short role) {
        if (email == null || !email.toLowerCase().endsWith("@gmail.com")) {
            throw new IllegalArgumentException("Only @gmail.com emails are allowed");
        }
        if (userRepository.existsByEmailId(email)) {
            throw new IllegalArgumentException("Email already registered");
        }
        var user = new UserEntity();
        user.setEmailId(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setFullname(fullname);
        user.setPhone(phone);
        user.setRole(role);
        user.setStatus((short) 1);
        UserEntity saved = userRepository.save(user);
        gemService.awardGems(saved.getId(), 50, "Welcome bonus! 🎉");
        emailService.sendWelcomeEmail(saved.getEmailId(), saved.getFullname());
        return EntityMapper.toUserDto(saved);
    }
}
