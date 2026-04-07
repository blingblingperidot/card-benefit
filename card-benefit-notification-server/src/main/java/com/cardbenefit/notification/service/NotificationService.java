package com.cardbenefit.notification.service;

import com.cardbenefit.notification.mapper.NotificationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private NotificationMapper notificationMapper;

    // FCM 토큰 조회
    public String getFcmToken(String userId) {
        Map<String, Object> user = notificationMapper.findFcmToken(userId);
        if (user == null) return null;
        return (String) user.get("FCM_TOKEN");
    }

    // 알림 이력 저장
    public void saveNotificationLog(String userId, String benefitId) {
        Map<String, Object> map = new HashMap<>();
        map.put("userId", userId);
        map.put("benefitId", benefitId);
        notificationMapper.insertNotificationLog(map);
    }
}