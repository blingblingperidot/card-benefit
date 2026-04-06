package com.cardbenefit.location.controller;

import com.cardbenefit.location.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    @Autowired
    private LocationService locationService;

    // 위치 업데이트
    @PostMapping("/update")
    public ResponseEntity<Map<String, Object>> updateLocation(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> map) {
        return ResponseEntity.ok(locationService.updateLocation(token, map));
    }
}