package com.cardbenefit.notification.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class FcmService {

    private static final String EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

    // Expo Push 알림 발송
    public void sendNotification(String expoPushToken, String title, String body) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> message = new HashMap<>();
            message.put("to", expoPushToken);
            message.put("title", title);
            message.put("body", body);
            message.put("sound", "default");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(message, headers);
            restTemplate.postForObject(EXPO_PUSH_URL, entity, String.class);

            System.out.println("Expo Push 발송 성공: " + title + " → " + expoPushToken);
        } catch (Exception e) {
            System.out.println("Expo Push 발송 실패: " + e.getMessage());
        }
    }
}