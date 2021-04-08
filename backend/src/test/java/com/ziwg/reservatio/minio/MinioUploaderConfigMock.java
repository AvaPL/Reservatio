package com.ziwg.reservatio.minio;

import io.minio.MinioClient;
import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class MinioUploaderConfigMock {

    @Bean
    @Primary
    public MinioUploaderMock minioUploaderMock() {
        MinioClient minioClient = Mockito.mock(MinioClient.class);
        return new MinioUploaderMock(minioClient, "mock", "mock");
    }
}
