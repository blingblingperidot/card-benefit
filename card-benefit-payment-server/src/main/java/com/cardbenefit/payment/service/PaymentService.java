package com.cardbenefit.payment.service;

import com.cardbenefit.payment.config.JwtUtil;
import com.cardbenefit.payment.mapper.PaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentMapper paymentMapper;
    private final KakaoPayService kakaoPayService;
    private final RedisTemplate<String, String> redisTemplate;
    private final JwtUtil jwtUtil;

    // 결제 준비
    public Map<String, Object> ready(Map<String, Object> request) {
        String token   = (String) request.get("token");
        String jwt     = token.replace("Bearer ", "");
        String userId  = jwtUtil.getUserIdFromToken(jwt);

        String benefitId      = (String) request.get("benefitId");
        String cardId         = (String) request.get("cardId");
        String itemName       = (String) request.get("itemName");
        int amount            = (int) request.get("amount");
        int discountAmount    = request.get("discountAmount") != null
                                ? (int) request.get("discountAmount") : 0;
        int finalAmount       = amount - discountAmount;
        String approvalUrl    = (String) request.get("approvalUrl");
        String cancelUrl      = (String) request.get("cancelUrl");
        String failUrl        = (String) request.get("failUrl");

        // 1차 방어 - Redis 분산락
        String lockKey = "payment:lock:" + userId;
        Boolean locked = redisTemplate.opsForValue()
                .setIfAbsent(lockKey, "locked", 30, TimeUnit.SECONDS);

        if (!Boolean.TRUE.equals(locked)) {
            throw new RuntimeException("이미 결제 진행 중입니다.");
        }

        try {
            // 2차 방어 - partner_order_id 생성 (멱등키)
            String partnerOrderId = "PAY-" + userId + "-" + System.currentTimeMillis();

            // payment_id 채번
            String paymentId = paymentMapper.getNextPaymentId();

            // payment_logs INSERT (PENDING)
            Map<String, Object> logMap = new HashMap<>();
            logMap.put("paymentId",      paymentId);
            logMap.put("userId",         userId);
            logMap.put("benefitId",      benefitId);
            logMap.put("cardId",         cardId);
            logMap.put("partnerOrderId", partnerOrderId);
            logMap.put("amount",         amount);
            logMap.put("discountAmount", discountAmount);
            logMap.put("finalAmount",    finalAmount);
            logMap.put("status",         "PENDING");
            paymentMapper.insertPaymentLog(logMap);

            // 카카오페이 결제 준비 호출
            Map<String, Object> kakaoResponse = kakaoPayService.ready(
                partnerOrderId, userId, itemName, 1, finalAmount,
                approvalUrl,
                cancelUrl,
                failUrl
            );

            // tid 저장
            String tid = (String) kakaoResponse.get("tid");
            Map<String, Object> updateMap = new HashMap<>();
            updateMap.put("partnerOrderId", partnerOrderId);
            updateMap.put("tid",            tid);
            updateMap.put("status",         "PENDING");
            updateMap.put("errorMessage",   null);
            paymentMapper.updatePaymentStatus(updateMap);

            Map<String, Object> result = new HashMap<>();
            result.put("nextRedirectPcUrl",     kakaoResponse.get("next_redirect_pc_url"));
            result.put("nextRedirectMobileUrl", kakaoResponse.get("next_redirect_mobile_url"));
            result.put("nextRedirectAppUrl",    kakaoResponse.get("next_redirect_app_url"));
            result.put("tid",                   tid);
            result.put("partnerOrderId",        partnerOrderId);
            return result;

        } catch (Exception e) {
            redisTemplate.delete(lockKey);
            throw new RuntimeException("결제 준비 실패: " + e.getMessage());
        }
    }

    // 결제 승인
    public Map<String, Object> approve(Map<String, Object> request) {
        String token          = (String) request.get("token");
        String jwt            = token.replace("Bearer ", "");
        String userId         = jwtUtil.getUserIdFromToken(jwt);
        String tid            = (String) request.get("tid");
        String partnerOrderId = (String) request.get("partnerOrderId");
        String pgToken        = (String) request.get("pgToken");
        String lockKey        = "payment:lock:" + userId;

        try {
            Map<String, Object> kakaoResponse = kakaoPayService.approve(
                tid, partnerOrderId, userId, pgToken);

            Map<String, Object> updateMap = new HashMap<>();
            updateMap.put("partnerOrderId", partnerOrderId);
            updateMap.put("tid",            tid);
            updateMap.put("status",         "SUCCESS");
            updateMap.put("errorMessage",   null);
            paymentMapper.updatePaymentStatus(updateMap);

            return kakaoResponse;

        } catch (Exception e) {
            Map<String, Object> updateMap = new HashMap<>();
            updateMap.put("partnerOrderId", partnerOrderId);
            updateMap.put("tid",            tid);
            updateMap.put("status",         "FAILED");
            updateMap.put("errorMessage",   e.getMessage());
            paymentMapper.updatePaymentStatus(updateMap);

            throw new RuntimeException("결제 승인 실패: " + e.getMessage());

        } finally {
            redisTemplate.delete(lockKey);
        }
    }

    // 결제 취소
    public Map<String, Object> cancel(Map<String, Object> request) {
        String tid            = (String) request.get("tid");
        String partnerOrderId = (String) request.get("partnerOrderId");
        int cancelAmount      = (int) request.get("cancelAmount");

        try {
            Map<String, Object> kakaoResponse = kakaoPayService.cancel(tid, cancelAmount);

            Map<String, Object> updateMap = new HashMap<>();
            updateMap.put("partnerOrderId", partnerOrderId);
            updateMap.put("tid",            tid);
            updateMap.put("status",         "CANCELLED");
            updateMap.put("errorMessage",   null);
            paymentMapper.updatePaymentStatus(updateMap);

            return kakaoResponse;

        } catch (Exception e) {
            Map<String, Object> updateMap = new HashMap<>();
            updateMap.put("partnerOrderId", partnerOrderId);
            updateMap.put("tid",            tid);
            updateMap.put("status",         "FAILED");
            updateMap.put("errorMessage",   e.getMessage());
            paymentMapper.updatePaymentStatus(updateMap);

            throw new RuntimeException("결제 취소 실패: " + e.getMessage());
        }
    }

    // 결제 내역 조회
    public List<Map<String, Object>> getPaymentList(String userId, String status) {
        Map<String, Object> map = new HashMap<>();
        if (userId != null) userId = userId.trim();
        if ("".equals(userId)) userId = null;
        map.put("userId", userId);
        map.put("status", status);
        return paymentMapper.getPaymentList(map);
    }

    // 강제 실패 테스트 (DLQ 테스트용)
    public void testFail(String userId) {
        String paymentId      = paymentMapper.getNextPaymentId();
        String partnerOrderId = "PAY-TEST-" + userId + "-" + System.currentTimeMillis();

        Map<String, Object> logMap = new HashMap<>();
        logMap.put("paymentId",      paymentId);
        logMap.put("userId",         userId);
        logMap.put("benefitId",      "TEST001");
        logMap.put("cardId",         "TEST001");
        logMap.put("partnerOrderId", partnerOrderId);
        logMap.put("amount",         1000);
        logMap.put("discountAmount", 0);
        logMap.put("finalAmount",    1000);
        logMap.put("status",         "FAILED");
        paymentMapper.insertPaymentLog(logMap);

        Map<String, Object> updateMap = new HashMap<>();
        updateMap.put("partnerOrderId", partnerOrderId);
        updateMap.put("tid",            null);
        updateMap.put("status",         "FAILED");
        updateMap.put("errorMessage",   "강제 실패 테스트");
        paymentMapper.updatePaymentStatus(updateMap);
    }
}