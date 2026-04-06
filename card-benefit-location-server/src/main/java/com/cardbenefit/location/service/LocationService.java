package com.cardbenefit.location.service;

import com.cardbenefit.location.config.JwtUtil;
import com.cardbenefit.location.config.LocationProducer;
import com.cardbenefit.location.mapper.LocationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LocationService {

    @Autowired
    private LocationMapper locationMapper;

    @Autowired
    private LocationProducer locationProducer;

    @Autowired
    private JwtUtil jwtUtil;

    // 위치 업데이트 및 근처 매장 탐지
    public Map<String, Object> updateLocation(String token, Map<String, Object> map) {
        String jwt = token.replace("Bearer ", "");
        if (!jwtUtil.validateToken(jwt)) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }
        String userId = jwtUtil.getUserIdFromToken(jwt);

        double userLat = Double.parseDouble(map.get("latitude").toString());
        double userLon = Double.parseDouble(map.get("longitude").toString());

        // 전체 혜택 매장 조회
        List<Map<String, Object>> benefits = locationMapper.getAllBenefits();

        // 근처 매장 탐지 (200m 이내)
        for (Map<String, Object> benefit : benefits) {
            double storeLat = Double.parseDouble(benefit.get("LATITUDE").toString());
            double storeLon = Double.parseDouble(benefit.get("LONGITUDE").toString());
            double distance = calculateDistance(userLat, userLon, storeLat, storeLon);

            if (distance <= 200) {
                String message = "{"
                        + "\"userId\":\"" + userId + "\","
                        + "\"benefitId\":\"" + benefit.get("BENEFIT_ID") + "\","
                        + "\"storeName\":\"" + benefit.get("STORE_NAME") + "\","
                        + "\"distance\":" + distance
                        + "}";
                locationProducer.sendLocationEvent(message);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("message", "위치 업데이트 성공");
        return result;
    }

    // 하버사인 공식 (두 좌표간 거리 계산 - 미터 단위)
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371000;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}