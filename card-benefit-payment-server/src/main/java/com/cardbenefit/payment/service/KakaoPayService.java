package com.cardbenefit.payment.service;

import com.cardbenefit.payment.config.KakaoPayConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class KakaoPayService {

    private final KakaoPayConfig kakaoPayConfig;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 공통 헤더
    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "SECRET_KEY " + kakaoPayConfig.getRestApiKey());
        return headers;
    }

    // 결제 준비
    public Map<String, Object> ready(String partnerOrderId, String userId,
                                      String itemName, int quantity,
                                      int totalAmount, String approvalUrl,
                                      String cancelUrl, String failUrl) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            Map<String, Object> params = new HashMap<>();
            params.put("cid",               kakaoPayConfig.getCid());
            params.put("partner_order_id",  partnerOrderId);
            params.put("partner_user_id",   userId);
            params.put("item_name",         itemName);
            params.put("quantity",          quantity);
            params.put("total_amount",      totalAmount);
            params.put("tax_free_amount",   0);
            params.put("approval_url",      approvalUrl);
            params.put("cancel_url",        cancelUrl);
            params.put("fail_url",          failUrl);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(params, getHeaders());
            String response = restTemplate.postForObject(
                kakaoPayConfig.getReadyUrl(), entity, String.class);

            System.out.println("카카오페이 결제 준비 응답: " + response);
            return objectMapper.readValue(response, Map.class);

        } catch (Exception e) {
            System.out.println("카카오페이 결제 준비 실패: " + e.getMessage());
            throw new RuntimeException("카카오페이 결제 준비 실패: " + e.getMessage());
        }
    }

    // 결제 승인
    public Map<String, Object> approve(String tid, String partnerOrderId,
                                        String userId, String pgToken) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            Map<String, Object> params = new HashMap<>();
            params.put("cid",              kakaoPayConfig.getCid());
            params.put("tid",              tid);
            params.put("partner_order_id", partnerOrderId);
            params.put("partner_user_id",  userId);
            params.put("pg_token",         pgToken);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(params, getHeaders());
            String response = restTemplate.postForObject(
                kakaoPayConfig.getApproveUrl(), entity, String.class);

            System.out.println("카카오페이 결제 승인 응답: " + response);
            return objectMapper.readValue(response, Map.class);

        } catch (Exception e) {
            System.out.println("카카오페이 결제 승인 실패: " + e.getMessage());
            throw new RuntimeException("카카오페이 결제 승인 실패: " + e.getMessage());
        }
    }

    // 결제 취소
    public Map<String, Object> cancel(String tid, int cancelAmount) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            Map<String, Object> params = new HashMap<>();
            params.put("cid",                kakaoPayConfig.getCid());
            params.put("tid",                tid);
            params.put("cancel_amount",      cancelAmount);
            params.put("cancel_tax_free_amount", 0);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(params, getHeaders());
            String response = restTemplate.postForObject(
                kakaoPayConfig.getCancelUrl(), entity, String.class);

            System.out.println("카카오페이 결제 취소 응답: " + response);
            return objectMapper.readValue(response, Map.class);

        } catch (Exception e) {
            System.out.println("카카오페이 결제 취소 실패: " + e.getMessage());
            throw new RuntimeException("카카오페이 결제 취소 실패: " + e.getMessage());
        }
    }
}