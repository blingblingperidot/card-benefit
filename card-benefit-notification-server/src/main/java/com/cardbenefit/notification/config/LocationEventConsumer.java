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
            String cardId    = (String) event.get("cardId");
            String cardType  = (String) event.get("cardType");

            String fcmToken = notificationService.getFcmToken(userId);
            if (fcmToken == null) {
                System.out.println("FCM 토큰 없음: " + userId);
                return;
            }

            notificationService.saveNotificationLog(userId, benefitId, storeName, cardId, cardType);

        } catch (Exception e) {
            System.out.println("location-event 처리 실패: " + e.getMessage());
        }
    }
}