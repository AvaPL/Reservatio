package com.ziwg.reservatio.minio;

import com.ziwg.reservatio.profiles.TestProfile;
import io.minio.MinioClient;
import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@TestProfile
@Configuration
public class MinioUploaderConfigMock {

    @Bean
    public MinioUploaderMock minioUploaderMock() {
        MinioClient minioClient = Mockito.mock(MinioClient.class);
        return new MinioUploaderMock(minioClient, "mock", "mock");
    }
}
