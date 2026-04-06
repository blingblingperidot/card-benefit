package com.cardbenefit.benefit.controller;

import com.cardbenefit.benefit.service.BenefitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/benefits")
public class BenefitController {

    @Autowired
    private BenefitService benefitService;

    // 혜택 조회 (cards INNER JOIN benefits)
    @GetMapping("/getCardBenefit")
    public ResponseEntity<List<Map<String, Object>>> getCardBenefit(
            @RequestParam String cardType) {
        return ResponseEntity.ok(benefitService.getCardBenefit(cardType));
    }

 // 혜택 데이터 등록 (관리자용)
    @PostMapping("/insertbenefit")
    public ResponseEntity<Map<String, Object>> insertBenefit(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> map) {
        return ResponseEntity.ok(benefitService.insertBenefit(token, map));
    }

    // 혜택 데이터 삭제 (관리자용)
    @PostMapping("/deletebenefit")
    public ResponseEntity<Map<String, Object>> deleteBenefit(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> map) {
        return ResponseEntity.ok(benefitService.deleteBenefit(token, map));
    }
 
 // 전체 혜택 목록 조회 (관리자용)
    @GetMapping("/getAllBenefits")
    public ResponseEntity<List<Map<String, Object>>> getAllBenefits(
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(benefitService.getAllBenefits(token));
    }   
}