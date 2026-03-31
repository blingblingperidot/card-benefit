package com.cardbenefit.user.config;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class RedisUtil {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    // 블랙리스트에 토큰 추가
    public void addBlacklist(String token, long expiration) {
        redisTemplate.opsForValue().set(
            "blacklist:" + token,
            "logout",
            expiration,
            TimeUnit.MILLISECONDS
        );
    }

    // 블랙리스트 확인
    public boolean isBlacklisted(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey("blacklist:" + token));
    }
}