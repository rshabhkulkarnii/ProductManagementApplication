package com.product.ProductManagementApplication.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Firebase Configuration
 * Initializes Firebase connection and Firestore
 */
@Configuration
public class FirebaseConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);
    
    @Value("${firebase.credentials}")
    private String firebaseCredentials;
    
    @Value("${firebase.database-url}")
    private String databaseUrl;
    
    /**
     * Initialize Firebase Admin SDK
     */
    @Bean
    public void initializeFirebase() throws IOException {
        logger.info("Initializing Firebase Admin SDK...");
        
        try {
            // Convert credentials string to InputStream
            GoogleCredentials credentials = GoogleCredentials.fromStream(
                new ByteArrayInputStream(firebaseCredentials.getBytes(StandardCharsets.UTF_8))
            );
            
            // Build Firebase options
            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(credentials)
                .setDatabaseUrl(databaseUrl)
                .build();
            
            // Initialize Firebase if not already initialized
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                logger.info("✅ Firebase Admin SDK initialized successfully!");
            }
        } catch (Exception e) {
            logger.error("❌ Failed to initialize Firebase: {}", e.getMessage(), e);
            throw new RuntimeException("Firebase initialization failed", e);
        }
    }
    
    /**
     * Provide Firestore instance
     */
    @Bean
    public Firestore getFirestore() {
        logger.info("Getting Firestore instance...");
        return FirestoreClient.getFirestore();
    }
}