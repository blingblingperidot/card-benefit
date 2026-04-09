package com.cardbenefit.notification.service;

import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 반환값: { expoMessageId, expoStatus, errorMessage }
    public Map<String, String> sendNotification(String expoPushToken, String title, String body) {
        Map<String, String> result = new HashMap<>();
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
            String response = restTemplate.postForObject(EXPO_PUSH_URL, entity, String.class);
            System.out.println("Expo Push API 응답: " + response);

            // 응답 파싱 → { "data": { "status": "ok", "id": "..." } }
            Map<String, Object> parsed = objectMapper.readValue(response, Map.class);
            Map<String, Object> data = (Map<String, Object>) parsed.get("data");

            String status = (String) data.get("status");
            String id     = (String) data.get("id");

            result.put("expoStatus",     "ok".equals(status) ? "OK" : "ERROR");
            result.put("expoMessageId",  id != null ? id : "");
            result.put("errorMessage",   "ok".equals(status) ? null : (String) data.get("message"));

            System.out.println("Expo Push 발송 " + status + ": " + title + " → " + expoPushToken);

        } catch (Exception e) {
            result.put("expoStatus",    "ERROR");
            result.put("expoMessageId", "");
            result.put("errorMessage",  e.getMessage());
            System.out.println("Expo Push 발송 실패: " + e.getMessage());
        }
        return result;
    }
}