package com.lpt.service;

import com.lpt.entity.UserStreakEntity;
import com.lpt.repository.UserStreakRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StreakService {

    private final UserStreakRepository userStreakRepository;
    private final GemService gemService;

    public StreakService(UserStreakRepository userStreakRepository, GemService gemService) {
        this.userStreakRepository = userStreakRepository;
        this.gemService = gemService;
    }

    @Transactional
    public UserStreakEntity updateStreak(Integer userId) {
        LocalDate today = LocalDate.now();
        UserStreakEntity streak = userStreakRepository.findByUserId(userId).orElseGet(() -> {
            UserStreakEntity created = new UserStreakEntity();
            created.setUserId(userId);
            created.setCurrentStreak(0);
            created.setLongestStreak(0);
            return created;
        });

        LocalDate lastLogin = streak.getLastLoginDate();
        if (lastLogin == null) {
            streak.setCurrentStreak(1);
            gemService.awardBadge(userId, "First Login", "🌱");
            gemService.awardGemsOnce(userId, 10, "Daily login bonus ☀️");
        } else if (lastLogin.equals(today)) {
            return streak;
        } else if (lastLogin.equals(today.minusDays(1))) {
            streak.setCurrentStreak(streak.getCurrentStreak() + 1);
            gemService.awardGems(userId, 10, "Daily login bonus ☀️");
        } else {
            streak.setCurrentStreak(1);
            gemService.awardGems(userId, 10, "Daily login bonus ☀️");
        }

        streak.setLastLoginDate(today);
        streak.setLongestStreak(Math.max(streak.getLongestStreak(), streak.getCurrentStreak()));
        streak.setLastUpdated(LocalDateTime.now());
        UserStreakEntity saved = userStreakRepository.save(streak);

        if (saved.getCurrentStreak() == 3) gemService.awardGemsOnce(userId, 30, "Streak bonus! 🔥");
        if (saved.getCurrentStreak() == 7) gemService.awardGemsOnce(userId, 100, "Week warrior bonus! 💪");
        gemService.checkAndAwardBadges(userId);
        return saved;
    }

    public Map<String, Object> getStreakInfo(Integer userId) {
        Map<String, Object> info = new HashMap<>();
        UserStreakEntity streak = userStreakRepository.findByUserId(userId).orElse(null);
        info.put("current_streak", streak == null ? 0 : streak.getCurrentStreak());
        info.put("longest_streak", streak == null ? 0 : streak.getLongestStreak());
        return info;
    }
}
