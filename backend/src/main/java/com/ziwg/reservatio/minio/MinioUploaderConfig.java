package com.ziwg.reservatio.minio;

import io.minio.MinioClient;
import lombok.Getter;
import lombok.Setter;
import lombok.val;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "reservatio.minio")
@Getter
@Setter
public class MinioUploaderConfig {

    private String endpoint;
    private String username;
    private String password;
    private String bucket;

    @Bean
    public MinioUploader minioUploader() {
        val minioClient = MinioClient.builder().endpoint(endpoint).credentials(username, password).build();
        return new MinioUploader(minioClient, bucket);
    }
}
