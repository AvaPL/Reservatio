package com.ziwg.reservatio.mvc;

import com.ziwg.reservatio.profiles.ProdProfile;
import lombok.Getter;
import lombok.Setter;
import lombok.val;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@ProdProfile
@Configuration
@ConfigurationProperties(prefix = "reservatio.cors")
@Getter
@Setter
public class CorsConfig {

    private List<String> allowedOrigins;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                val allowedOriginsArray = allowedOrigins.toArray(new String[0]);
                registry.addMapping("/**").allowedOrigins(allowedOriginsArray);
            }
        };
    }
}
