package com.lpt.service;

import com.lpt.entity.BadgeEntity;
import com.lpt.entity.GemTransactionEntity;
import com.lpt.entity.UserGemsEntity;
import com.lpt.repository.BadgeRepository;
import com.lpt.repository.GemTransactionRepository;
import com.lpt.repository.UserGemsRepository;
import com.lpt.repository.UserStreakRepository;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GemService {

    private final UserGemsRepository userGemsRepository;
    private final GemTransactionRepository gemTransactionRepository;
    private final BadgeRepository badgeRepository;
    private final UserStreakRepository userStreakRepository;

    public GemService(
            UserGemsRepository userGemsRepository,
            GemTransactionRepository gemTransactionRepository,
            BadgeRepository badgeRepository,
            UserStreakRepository userStreakRepository) {
        this.userGemsRepository = userGemsRepository;
        this.gemTransactionRepository = gemTransactionRepository;
        this.badgeRepository = badgeRepository;
        this.userStreakRepository = userStreakRepository;
    }

    @Transactional
    public void awardGems(Integer userId, int amount, String reason) {
        try {
            UserGemsEntity gems = userGemsRepository.findByUserId(userId).orElseGet(() -> {
                UserGemsEntity created = new UserGemsEntity();
                created.setUserId(userId);
                created.setTotalGems(0);
                return created;
            });
            gems.setTotalGems(gems.getTotalGems() + amount);
            gems.setLastUpdated(LocalDateTime.now());
            userGemsRepository.save(gems);

            GemTransactionEntity tx = new GemTransactionEntity();
            tx.setUserId(userId);
            tx.setGemsEarned(amount);
            tx.setReason(reason);
            tx.setCreatedAt(LocalDateTime.now());
            gemTransactionRepository.save(tx);
            checkAndAwardBadges(userId);
        } catch (Exception ignored) {
        }
    }

    @Transactional
    public void awardGemsOnce(Integer userId, int amount, String reason) {
        if (!gemTransactionRepository.existsByUserIdAndReason(userId, reason)) {
            awardGems(userId, amount, reason);
        }
    }

    @Transactional
    public void awardBadge(Integer userId, String badgeName, String emoji) {
        try {
            if (badgeRepository.existsByUserIdAndBadgeName(userId, badgeName)) {
                return;
            }
            BadgeEntity badge = new BadgeEntity();
            badge.setUserId(userId);
            badge.setBadgeName(badgeName);
            badge.setBadgeEmoji(emoji);
            badge.setEarnedAt(LocalDateTime.now());
            badgeRepository.save(badge);
        } catch (Exception ignored) {
        }
    }

    public Map<String, Object> getUserGems(Integer userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            UserGemsEntity gems = userGemsRepository.findByUserId(userId).orElseGet(() -> {
                UserGemsEntity created = new UserGemsEntity();
                created.setUserId(userId);
                created.setTotalGems(0);
                return userGemsRepository.save(created);
            });
            response.put("code", 200);
            response.put("message", "Gems loaded");
            response.put("total_gems", gems.getTotalGems());
            response.put("transactions", gemTransactionRepository.findByUserIdOrderByCreatedAtDesc(userId));
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }

    public Map<String, Object> getUserBadges(Integer userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("code", 200);
            response.put("message", "Badges loaded");
            response.put("badges", badgeRepository.findByUserIdOrderByEarnedAtDesc(userId));
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }

    @Transactional
    public void checkAndAwardBadges(Integer userId) {
        try {
            int totalGems = userGemsRepository.findByUserId(userId).map(UserGemsEntity::getTotalGems).orElse(0);
            int streak = userStreakRepository.findByUserId(userId).map(s -> s.getCurrentStreak()).orElse(0);
            if (streak >= 3) awardBadge(userId, "3-Day Streak", "🔥");
            if (streak >= 7) awardBadge(userId, "Week Warrior", "💪");
            if (streak >= 30) awardBadge(userId, "Consistent Learner", "🏆");
            if (totalGems >= 500) awardBadge(userId, "Top Learner", "👑");
        } catch (Exception ignored) {
        }
    }
}
