package com.cardbenefit.notification.config;

import com.cardbenefit.notification.service.FcmService;
import com.cardbenefit.notification.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class LocationEventConsumer {

    @Autowired
    private FcmService fcmService;

    @Autowired
    private NotificationService notificationService;

    @KafkaListener(topics = "location-event", groupId = "notification-group")
    public void consume(String message) {
        try {
            System.out.println("location-event 수신: " + message);

            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> event = mapper.readValue(message, Map.class);

            String userId = (String) event.get("userId");
            String benefitId = (String) event.get("benefitId");
            String storeName = (String) event.get("storeName");
            double distance = Double.parseDouble(event.get("distance").toString());

            // FCM 토큰 조회
            String fcmToken = notificationService.getFcmToken(userId);

            if (fcmToken != null) {
                // FCM 푸시 알림 발송
                String title = "근처 혜택 매장 발견!";
                String body = storeName + " 매장이 " + Math.round(distance) + "m 근처에 있어요!";
                fcmService.sendNotification(fcmToken, title, body);
            }

            // 알림 이력 저장
            notificationService.saveNotificationLog(userId, benefitId);

        } catch (Exception e) {
            System.out.println("location-event 처리 실패: " + e.getMessage());
        }
    }
}