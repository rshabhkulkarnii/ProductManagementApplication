package com.product.ProductManagementApplication.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class corsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
                // Apply to all API endpoints
                .addMapping("/api/**")
                // Allow requests from React frontend
                .allowedOrigins("http://localhost:3000")
                // Allow these HTTP methods
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // Allow credentials (cookies, authorization headers)
                .allowCredentials(true)
                // Allow these request headers
                .allowedHeaders("*")
                // How long to cache CORS preflight response
                .maxAge(3600);
    }
}
