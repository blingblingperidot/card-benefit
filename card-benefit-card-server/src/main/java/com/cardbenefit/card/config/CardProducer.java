package com.cardbenefit.card.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class CardProducer {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendCardEvent(String message) {
        kafkaTemplate.send("card-event", message);
    }
}