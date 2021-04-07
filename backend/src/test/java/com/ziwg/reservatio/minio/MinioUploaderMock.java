package com.ziwg.reservatio.minio;

import com.ziwg.reservatio.minio.MinioUploader;
import io.minio.MinioClient;
import io.minio.ObjectWriteResponse;
import okhttp3.Headers;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Path;

public class MinioUploaderMock extends MinioUploader {

    private final String mockString = "mock";
    private final ObjectWriteResponse mockResponse = new ObjectWriteResponse(Headers.of(),
            mockString, mockString, mockString, mockString, mockString);

    public MinioUploaderMock(MinioClient minioClient, String minioBucket, String bucketPolicy) {
        super(minioClient, minioBucket, bucketPolicy);
    }

    @Override
    public String getMinioBucket() {
        return mockString;
    }

    @Override
    public ObjectWriteResponse upload(File file, String key) {
        return mockResponse;
    }

    @Override
    public ObjectWriteResponse upload(Path filepath, String key) {
        return mockResponse;
    }

    @Override
    public ObjectWriteResponse upload(InputStream inputStream, String key, String contentType) {
        return mockResponse;
    }

    @Override
    public String urlFor(String key) {
        return mockString;
    }
}
