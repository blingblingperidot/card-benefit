package com.cardbenefit.notification.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
//notification 
@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() throws IOException {
        ClassPathResource resource = new ClassPathResource("firebase-service-account.json");
        GoogleCredentials credentials = GoogleCredentials
                .fromStream(resource.getInputStream());

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(credentials)
                .build();

        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }
    }
}