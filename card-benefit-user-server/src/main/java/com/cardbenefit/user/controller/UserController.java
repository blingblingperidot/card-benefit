package com.cardbenefit.user.controller;

import com.cardbenefit.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Map<String, Object> map) {
        return ResponseEntity.ok(userService.signup(map));
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, Object> map) {
        return ResponseEntity.ok(userService.login(map));
    }

    // 프로필 조회
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(userService.getProfile(token));
    }
 // 아이디 중복 확인
    @GetMapping("/check-id")
    public ResponseEntity<Map<String, Object>> checkId(@RequestParam String userId) {
        return ResponseEntity.ok(userService.checkUserId(userId));
    }    
 // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(userService.logout(token));
    }   
 // FCM 토큰 저장
    @PostMapping("/fcm-token")
    public ResponseEntity<Map<String, Object>> saveFcmToken(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> map) {
        return ResponseEntity.ok(userService.saveFcmToken(token, map));
    }    
}