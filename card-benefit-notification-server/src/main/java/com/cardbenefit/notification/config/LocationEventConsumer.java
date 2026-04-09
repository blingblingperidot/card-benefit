package com.cardbenefit.notification.config;

import com.cardbenefit.notification.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class LocationEventConsumer {

    @Autowired
    private NotificationService notificationService;

    @KafkaListener(topics = "location-event", groupId = "notification-group")
    public void consume(String message) {
        try {
            System.out.println("location-event 수신: " + message);

            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> event = mapper.readValue(message, Map.class);

            String userId    = (String) event.get("userId");
            String benefitId = (String) event.get("benefitId");
            String storeName = (String) event.get("storeName");

            String fcmToken = notificationService.getFcmToken(userId);
            if (fcmToken == null) {
                System.out.println("FCM 토큰 없음: " + userId);
                return;
            }

            // 발송 + DB 저장 한번에
            notificationService.saveNotificationLog(userId, benefitId, storeName);

        } catch (Exception e) {
            System.out.println("location-event 처리 실패: " + e.getMessage());
        }
    }
}