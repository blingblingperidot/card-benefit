package com.cardbenefit.notification.mapper;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Map;

@Mapper
public interface NotificationMapper {

    Map<String, Object> getFcmToken(String userId);

    void insertNotificationLog(Map<String, Object> map);

    void updateFcmStatus(Map<String, Object> map);

    List<Map<String, Object>> getNotificationList(Map<String, Object> params);
    String getNextLogId();
   
}