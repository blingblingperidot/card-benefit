package com.cardbenefit.card.service;

import com.cardbenefit.card.mapper.CardMapper;
import com.cardbenefit.card.config.CardProducer;
import com.cardbenefit.card.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CardService {

    @Autowired
    private CardMapper cardMapper;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private CardProducer cardProducer;

    // 내 카드 목록 조회
    public List<Map<String, Object>> getCards(String token) {
        String jwt = token.replace("Bearer ", "");
        String userId = jwtUtil.getUserIdFromToken(jwt);
        return cardMapper.findByUserId(userId);
    }

    // 카드 등록
    public Map<String, Object> registerCard(String token, Map<String, Object> map) {
        String jwt = token.replace("Bearer ", "");
        String userId = jwtUtil.getUserIdFromToken(jwt);
        map.put("userId", userId);
        cardMapper.insertCard(map);
        

        // Kafka 이벤트 발행
        String message = "{\"userId\":\"" + userId + "\",\"cardType\":\"" + map.get("cardType") + "\",\"action\":\"INSERT\"}";
        cardProducer.sendCardEvent(message);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "카드 등록 성공");
        return result;
    }

    public Map<String, Object> deleteCard(String token, String cardId) {
        String jwt = token.replace("Bearer ", "");
        String userId = jwtUtil.getUserIdFromToken(jwt);

        Map<String, Object> card = cardMapper.findByCardIdAndUserId(cardId, userId);
        if (card == null) {
            throw new RuntimeException("카드를 찾을 수 없습니다.");
        }

        String message = "{\"userId\":\"" + userId + "\",\"cardType\":\"" + card.get("CARD_TYPE") + "\",\"action\":\"DELETE\"}";
        cardProducer.sendCardEvent(message);

        cardMapper.deleteCard(cardId);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "카드 삭제 성공");
        return result;
    } 
}