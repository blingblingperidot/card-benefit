package com.cardbenefit.benefit.service;

import com.cardbenefit.benefit.config.JwtUtil;
import com.cardbenefit.benefit.mapper.BenefitMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BenefitService {

    @Autowired
    private BenefitMapper benefitMapper;

    @Autowired
    private JwtUtil jwtUtil;

 // 혜택 조회 (누구나 가능)
    public List<Map<String, Object>> getCardBenefit(String cardType) {
        return benefitMapper.getCardBenefit(cardType);
    }

    // 혜택 등록 (ADMIN만 가능)
    public Map<String, Object> insertBenefit(String token, Map<String, Object> map) {
        checkAdmin(token);
        benefitMapper.insertBenefit(map);
        Map<String, Object> result = new HashMap<>();
        result.put("message", "혜택 등록 성공");
        return result;
    }

    // 혜택 삭제 (ADMIN만 가능)
    public Map<String, Object> deleteBenefit(String token, Map<String, Object> map) {
        checkAdmin(token);
        benefitMapper.deleteBenefit(map);
        Map<String, Object> result = new HashMap<>();
        result.put("message", "혜택 삭제 성공");
        return result;
    }

    // ADMIN 체크
    private void checkAdmin(String token) {
        String jwt = token.replace("Bearer ", "");
        if (!jwtUtil.validateToken(jwt)) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }
        String usrTpCd = jwtUtil.getUsrTpCdFromToken(jwt);
        if (!"ADMIN".equals(usrTpCd)) {
            throw new RuntimeException("관리자만 접근 가능합니다.");
        }
    }
    public List<Map<String, Object>> getAllBenefits(String token) {
        checkAdmin(token);
        return benefitMapper.getAllBenefits();
    }    
}