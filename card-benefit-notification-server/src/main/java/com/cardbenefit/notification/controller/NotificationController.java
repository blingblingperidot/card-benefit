package com.cardbenefit.notification.controller;

import com.cardbenefit.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // 알림 목록 조회
    @GetMapping("/getNotificationList")
    public ResponseEntity<?> getNotificationList(@RequestParam String userId) {
        List<Map<String, Object>> list = notificationService.getNotificationList(userId);
        return ResponseEntity.ok(list);
    }

    // FCM Receipt 조회 후 DB 업데이트
    @PostMapping("/refreshFcmStatus")
    public ResponseEntity<?> refreshFcmStatus(@RequestBody Map<String, Object> body) {
        List<String> ids = (List<String>) body.get("ids");
        notificationService.refreshFcmStatus(ids);
        return ResponseEntity.ok(Map.of("message", "FCM 상태 업데이트 완료"));
    }
}