package com.cardbenefit.card.mapper;

import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Map;

@Mapper
public interface CardMapper {

    // 카드 목록 조회
    List<Map<String, Object>> findByUserId(String userId);

    // 카드 등록
    void insertCard(Map<String, Object> map);

    // 카드 ID + 사용자 ID로 조회
    Map<String, Object> findByCardIdAndUserId(String cardId, String userId);

    // 카드 삭제  
    void deleteCard(String cardId);
}