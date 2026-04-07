package com.cardbenefit.notification.mapper;

import org.apache.ibatis.annotations.Mapper;
import java.util.Map;

@Mapper
public interface NotificationMapper {

    // FCM 토큰 조회
    Map<String, Object> findFcmToken(String userId);

    // 알림 이력 저장
    void insertNotificationLog(Map<String, Object> map);
}