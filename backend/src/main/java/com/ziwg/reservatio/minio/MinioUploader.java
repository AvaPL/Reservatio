package com.ziwg.reservatio.minio;

import io.minio.*;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import lombok.val;

import java.io.File;

@Slf4j
@RequiredArgsConstructor
public class MinioUploader {
    private final MinioClient minioClient;
    private final String minioBucket;

    public ObjectWriteResponse upload(File file, String key) {
        val path = file.getAbsolutePath();
        return upload(path, key);
    }

    public ObjectWriteResponse upload(String filepath, String key) {
        if (!bucketExists()) {
            log.info("Bucket '" + minioBucket + "' does not exist");
            makeBucket();
        }
        return uploadObject(filepath, key);
    }

    @SneakyThrows
    private boolean bucketExists() {
        BucketExistsArgs args = BucketExistsArgs.builder().bucket(minioBucket).build();
        return minioClient.bucketExists(args);
    }

    @SneakyThrows
    private void makeBucket() {
        MakeBucketArgs args = MakeBucketArgs.builder().bucket(minioBucket).build();
        minioClient.makeBucket(args);
        log.info("Created new bucket '" + minioBucket + "'");
    }

    @SneakyThrows
    private ObjectWriteResponse uploadObject(String filepath, String key) {
        UploadObjectArgs args = UploadObjectArgs.builder().bucket(minioBucket).object(key).filename(filepath).build();
        val response = minioClient.uploadObject(args);
        log.info("Uploaded new object '" + key + "' to bucket '" + minioBucket + "'");
        return response;
    }
}
