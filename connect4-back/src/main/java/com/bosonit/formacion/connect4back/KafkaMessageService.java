package com.bosonit.formacion.connect4back;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaMessageService {

    private String latestKafkaMessage;

    @KafkaListener(topics = "partida")
    public void consumeMessage(String message) {
        // Cuando se consume un mensaje de Kafka, actualiza el último mensaje
        latestKafkaMessage = message;
    }

    public String getLatestMessage() {
        return latestKafkaMessage;
    }
}

