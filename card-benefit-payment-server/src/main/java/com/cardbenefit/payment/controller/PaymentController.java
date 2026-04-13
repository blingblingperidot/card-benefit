package com.cardbenefit.payment.controller;

import com.cardbenefit.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // 결제 준비
    @PostMapping("/ready")
    public ResponseEntity<?> ready(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> request) {
        request.put("token", token);
        return ResponseEntity.ok(paymentService.ready(request));
    }

    // 결제 승인
    @PostMapping("/approve")
    public ResponseEntity<?> approve(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> request) {
        request.put("token", token);
        return ResponseEntity.ok(paymentService.approve(request));
    }

    // 결제 취소
    @PostMapping("/cancel")
    public ResponseEntity<?> cancel(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> request) {
        request.put("token", token);
        return ResponseEntity.ok(paymentService.cancel(request));
    }

    // 결제 내역 조회
    @GetMapping("/list")
    public ResponseEntity<?> getPaymentList(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(paymentService.getPaymentList(userId, status));
    }

    // 강제 실패 테스트 (DLQ 테스트용)
    @PostMapping("/test/fail")
    public ResponseEntity<?> testFail(@RequestBody Map<String, Object> request) {
        String userId = (String) request.get("userId");
        paymentService.testFail(userId);
        return ResponseEntity.ok(Map.of("message", "강제 실패 기록 완료"));
    }
}