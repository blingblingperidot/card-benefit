package com.cardbenefit.location.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class LocationProducer {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void sendLocationEvent(String message) {
        kafkaTemplate.send("location-event", message);
    }
}