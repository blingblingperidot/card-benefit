package com.cardbenefit.location.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class RedisUtil {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    // 알림 중복 체크
    public boolean isAlreadyNotified(String userId, String benefitId) {
        String key = "location:" + userId + ":" + benefitId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    // 알림 발송 기록 저장 (1시간 TTL)
    public void saveNotified(String userId, String benefitId) {
        String key = "location:" + userId + ":" + benefitId;
        redisTemplate.opsForValue().set(key, "notified", 1, TimeUnit.HOURS);
    }
}