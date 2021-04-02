package com.ziwg.reservatio;

import com.ziwg.reservatio.minio.MinioUploader;
import io.minio.MinioClient;
import io.minio.ObjectWriteResponse;
import okhttp3.Headers;

import java.io.File;
import java.nio.file.Path;

public class MinioUploaderMock extends MinioUploader {

    private final String mockString = "mock";

    public MinioUploaderMock(MinioClient minioClient, String minioBucket, String bucketPolicy) {
        super(minioClient, minioBucket, bucketPolicy);
    }

    @Override
    public String getMinioBucket() {
        return mockString;
    }

    @Override
    public ObjectWriteResponse upload(File file, String key) {
        return new ObjectWriteResponse(Headers.of(), mockString, mockString, mockString, mockString, mockString);
    }

    @Override
    public ObjectWriteResponse upload(Path filepath, String key) {
        return new ObjectWriteResponse(Headers.of(), mockString, mockString, mockString, mockString, mockString);
    }

    @Override
    public String urlFor(String key) {
        return mockString;
    }
}
