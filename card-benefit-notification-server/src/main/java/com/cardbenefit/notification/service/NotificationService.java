package com.cardbenefit.notification.service;

import com.cardbenefit.notification.mapper.NotificationMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private NotificationMapper notificationMapper;

    @Autowired
    private FcmService fcmService;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String EXPO_RECEIPT_URL = "https://exp.host/--/api/v2/push/getReceipts";

    public String getFcmToken(String userId) {
        Map<String, Object> user = notificationMapper.getFcmToken(userId);
        if (user == null) return null;
        return (String) user.get("FCM_TOKEN");
    }

    public void saveNotificationLog(String userId, String benefitId, String storeName,
                                     String cardId, String cardType) {
        String fcmToken = getFcmToken(userId);
        String logId = notificationMapper.getNextLogId();

        Map<String, String> expoResult = fcmService.sendNotification(
            fcmToken,
            "근처 혜택 매장 발견!",
            storeName + " 매장이 근처에 있어요!",
            benefitId,
            storeName,
            cardId,
            cardType
        );

        Map<String, Object> map = new HashMap<>();
        map.put("userId",        userId);
        map.put("benefitId",     benefitId);
        map.put("expoMessageId", expoResult.get("expoMessageId"));
        map.put("expoStatus",    expoResult.get("expoStatus"));
        map.put("errorMessage",  expoResult.get("errorMessage"));
        map.put("logId",         logId);
        notificationMapper.insertNotificationLog(map);

        // 30초 후 FCM 전달 상태 자동 조회
        String expoMessageId = expoResult.get("expoMessageId");
        if (expoMessageId != null && !expoMessageId.isEmpty()) {
            new Thread(() -> {
                try {
                    Thread.sleep(30000);
                    refreshFcmStatus(List.of(expoMessageId));
                } catch (Exception e) {
                    System.out.println("FCM Receipt 자동 조회 실패: " + e.getMessage());
                }
            }).start();
        }
    }

    public List<Map<String, Object>> getNotificationList(String userId) {
        if (userId != null) userId = userId.trim();
        if ("".equals(userId)) userId = null;

        Map<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        return notificationMapper.getNotificationList(params);
    }

    public void refreshFcmStatus(List<String> ids) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("ids", ids);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            String response = restTemplate.postForObject(EXPO_RECEIPT_URL, entity, String.class);
            System.out.println("Receipt 조회 응답: " + response);

            Map<String, Object> parsed = objectMapper.readValue(response, Map.class);
            Map<String, Object> data = (Map<String, Object>) parsed.get("data");

            for (String id : ids) {
                Map<String, Object> receipt = (Map<String, Object>) data.get(id);
                if (receipt == null) continue;

                String status = (String) receipt.get("status");
                Map<String, Object> details = (Map<String, Object>) receipt.get("details");
                String errorMsg = details != null ? (String) details.get("error") : null;

                Map<String, Object> updateMap = new HashMap<>();
                updateMap.put("expoMessageId", id);
                updateMap.put("fcmStatus",     "ok".equals(status) ? "OK" : "ERROR");
                updateMap.put("errorMessage",  errorMsg);
                notificationMapper.updateFcmStatus(updateMap);
            }

        } catch (Exception e) {
            System.out.println("Receipt 조회 실패: " + e.getMessage());
        }
    }
}