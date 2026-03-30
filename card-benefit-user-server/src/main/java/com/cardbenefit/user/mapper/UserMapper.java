package com.cardbenefit.user.mapper;

import org.apache.ibatis.annotations.Mapper;
import java.util.Map;


@Mapper
public interface UserMapper {

    void insertUser(Map<String, Object> map);

    Map<String, Object> findByEmail(String email);

    Map<String, Object> findById(String userId);  // Long → String으로 변경
    
    // 아이디 중복확인
    Map<String, Object> checkUserId(String userId);
}