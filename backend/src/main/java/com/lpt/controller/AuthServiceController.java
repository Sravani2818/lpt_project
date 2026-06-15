package com.lpt.controller;

import com.lpt.dto.SigninSchema;
import com.lpt.dto.SignupSchema;
import com.lpt.dto.UsersUpsertSchema;
import com.lpt.service.GemService;
import com.lpt.service.StreakService;
import com.lpt.service.UsersServiceOld;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/authservice")
public class AuthServiceController {

    private final UsersServiceOld usersServiceOld;
    private final GemService gemService;
    private final StreakService streakService;

    public AuthServiceController(UsersServiceOld usersServiceOld, GemService gemService, StreakService streakService) {
        this.usersServiceOld = usersServiceOld;
        this.gemService = gemService;
        this.streakService = streakService;
    }

    @PostMapping("/signin")
    public Map<String, Object> signin(@RequestBody SigninSchema req) {
        return usersServiceOld.signinService(req);
    }

    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody SignupSchema req) {
        return usersServiceOld.signupService(req);
    }

    @GetMapping("/uinfo")
    public Map<String, Object> uinfo(@RequestHeader("Token") String token) {
        return usersServiceOld.uinfo(token);
    }

    @GetMapping("/profile")
    public Map<String, Object> profile(@RequestHeader("Token") String token) {
        return usersServiceOld.profile(token);
    }

    @GetMapping("/getallusers/{page}/{limit}")
    public Map<String, Object> getAllUsers(
            @PathVariable("page") int page,
            @PathVariable("limit") int limit,
            @RequestHeader("Token") String token) {
        return usersServiceOld.getAllUsers(page, limit, token);
    }

    @GetMapping("/getuser/{id}")
    public Map<String, Object> getUser(
            @PathVariable("id") int id,
            @RequestHeader("Token") String token) {
        return usersServiceOld.getUserById(id, token);
    }

    @PostMapping("/saveuser")
    public Map<String, Object> saveUser(
            @RequestBody UsersUpsertSchema req,
            @RequestHeader("Token") String token) {
        return usersServiceOld.saveUser(req, token);
    }

    @PutMapping("/updateuser/{id}")
    public Map<String, Object> updateUser(
            @PathVariable("id") int id,
            @RequestBody UsersUpsertSchema req,
            @RequestHeader("Token") String token) {
        return usersServiceOld.updateUser(id, req, token);
    }

    @DeleteMapping("/deleteuser/{id}")
    public Map<String, Object> deleteUser(
            @PathVariable("id") int id,
            @RequestHeader("Token") String token) {
        return usersServiceOld.deleteUser(id, token);
    }

    @GetMapping("/gems/{userId}")
    public Map<String, Object> gems(@PathVariable("userId") int userId) {
        return gemService.getUserGems(userId);
    }

    @GetMapping("/badges/{userId}")
    public Map<String, Object> badges(@PathVariable("userId") int userId) {
        return gemService.getUserBadges(userId);
    }

    @GetMapping("/streak/{userId}")
    public Map<String, Object> streak(@PathVariable("userId") int userId) {
        Map<String, Object> response = streakService.getStreakInfo(userId);
        response.put("code", 200);
        response.put("message", "Streak loaded");
        return response;
    }
}

