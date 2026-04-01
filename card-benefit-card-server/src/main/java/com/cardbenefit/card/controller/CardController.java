package com.cardbenefit.card.controller;

import com.cardbenefit.card.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    @Autowired
    private CardService cardService;

    // 내 카드 목록 조회
    @GetMapping("/getcards")
    public ResponseEntity<List<Map<String, Object>>> getCards(
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(cardService.getCards(token));
    }

    // 카드 등록
    @PostMapping(("/insertcards"))
    public ResponseEntity<Map<String, Object>> registerCard(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> map) {
        return ResponseEntity.ok(cardService.registerCard(token, map));
    }

    @PostMapping("/deletecards")
    public ResponseEntity<Map<String, Object>> deleteCard(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> map) {
        String cardId = map.get("cardId").toString();
        return ResponseEntity.ok(cardService.deleteCard(token, cardId));
    }  
}