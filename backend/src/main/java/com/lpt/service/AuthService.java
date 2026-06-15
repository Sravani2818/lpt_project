package com.lpt.service;

import com.lpt.dto.AuthResponse;
import com.lpt.dto.LoginRequest;
import com.lpt.mapper.EntityMapper;
import com.lpt.repository.UserRepository;
import com.lpt.security.JwtService;
import com.lpt.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final StreakService streakService;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository,
            StreakService streakService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.streakService = streakService;
    }

    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email_id(), request.password()));
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        var user = principal.getUser();
        streakService.updateStreak(user.getId());
        String token = jwtService.generateToken(user.getId(), user.getRole(), user.getEmailId());
        return new AuthResponse(EntityMapper.toUserDto(user), token);
    }

    public AuthResponse me(String email) {
        var user = userRepository
                .findByEmailId(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        String token = jwtService.generateToken(user.getId(), user.getRole(), user.getEmailId());
        return new AuthResponse(EntityMapper.toUserDto(user), token);
    }
}
