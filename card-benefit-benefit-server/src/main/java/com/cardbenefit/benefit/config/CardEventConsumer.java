package com.cardbenefit.benefit.config;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class CardEventConsumer {

    @KafkaListener(topics = "card-event", groupId = "benefit-group")
    public void consume(String message) {
        System.out.println("card-event 수신: " + message);
        // 추후 카드 등록/삭제 시 혜택 매핑 처리 로직 추가
    }
}