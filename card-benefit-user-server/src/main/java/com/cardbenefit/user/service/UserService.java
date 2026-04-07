package com.cardbenefit.user.service;

import com.cardbenefit.user.config.JwtUtil;
import com.cardbenefit.user.config.RedisUtil;
import com.cardbenefit.user.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RedisUtil redisUtil;

    // 회원가입
    public Map<String, Object> signup(Map<String, Object> map) {
        Map<String, Object> existUser = userMapper.findById((String) map.get("userId"));
        if (existUser != null) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        Map<String, Object> existEmail = userMapper.findByEmail((String) map.get("email"));
        if (existEmail != null) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        String encodedPassword = passwordEncoder.encode((String) map.get("password"));
        map.put("password", encodedPassword);

        userMapper.insertUser(map);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "회원가입 성공");
        return result;
    }

    // 아이디 중복 확인
    public Map<String, Object> checkUserId(String userId) {
        Map<String, Object> user = userMapper.checkUserId(userId);
        Map<String, Object> result = new HashMap<>();
        if (user != null) {
            result.put("isDuplicate", true);
            result.put("message", "이미 사용중인 아이디입니다.");
        } else {
            result.put("isDuplicate", false);
            result.put("message", "사용 가능한 아이디입니다.");
        }
        return result;
    }

    // 로그인
    public Map<String, Object> login(Map<String, Object> map) {
        String userId = (String) map.get("userId");
        String password = (String) map.get("password");

        Map<String, Object> user = userMapper.findById(userId);
        if (user == null) {
            throw new RuntimeException("존재하지 않는 아이디입니다.");
        }

        if (!passwordEncoder.matches(password, (String) user.get("PASSWORD"))) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        String usrTpCd = (String) user.get("USR_TP_CD");
        String token = jwtUtil.generateToken(userId, usrTpCd);

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("userId", userId);
        result.put("nickname", user.get("NICKNAME"));
        result.put("usrTpCd", usrTpCd);
        return result;
    }

    // 프로필 조회
    public Map<String, Object> getProfile(String token) {
        String jwt = token.replace("Bearer ", "");

        if (!jwtUtil.validateToken(jwt)) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        if (redisUtil.isBlacklisted(jwt)) {
            throw new RuntimeException("로그아웃된 토큰입니다.");
        }

        String userId = jwtUtil.getUserIdFromToken(jwt);
        Map<String, Object> user = userMapper.findById(userId);

        Map<String, Object> result = new HashMap<>();
        result.put("userId", user.get("USER_ID"));
        result.put("email", user.get("EMAIL"));
        result.put("nickname", user.get("NICKNAME"));
        result.put("usrTpCd", user.get("USR_TP_CD"));
        return result;
    }

    // 로그아웃
    public Map<String, Object> logout(String token) {
        String jwt = token.replace("Bearer ", "");
        long expiration = jwtUtil.getExpiration(jwt);
        redisUtil.addBlacklist(jwt, expiration);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "로그아웃 성공");
        return result;
    }
 // FCM 토큰 저장
    public Map<String, Object> saveFcmToken(String token, Map<String, Object> map) {
        String jwt = token.replace("Bearer ", "");
        String userId = jwtUtil.getUserIdFromToken(jwt);
        map.put("userId", userId);
        userMapper.updateFcmToken(map);
        Map<String, Object> result = new HashMap<>();
        result.put("message", "FCM 토큰 저장 성공");
        return result;
    }    
}