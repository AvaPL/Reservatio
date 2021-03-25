package com.ziwg.reservatio.minio;

import io.minio.*;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import lombok.val;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;

@Slf4j
@RequiredArgsConstructor
public class MinioUploader {

    private final MinioClient minioClient;
    private final String minioBucket;
    private final String bucketPolicy;

    public ObjectWriteResponse upload(File file, String key) {
        val filepath = file.toPath();
        return upload(filepath, key);
    }

    public ObjectWriteResponse upload(Path filepath, String key) {
        if (!bucketExists()) {
            log.info("Bucket '" + minioBucket + "' does not exist");
            makeBucket();
        }
        return uploadObject(filepath, key);
    }

    @SneakyThrows
    private boolean bucketExists() {
        val args = BucketExistsArgs.builder().bucket(minioBucket).build();
        return minioClient.bucketExists(args);
    }

    @SneakyThrows
    private void makeBucket() {
        val makeBucketArgs = MakeBucketArgs.builder().bucket(minioBucket).build();
        minioClient.makeBucket(makeBucketArgs);
        val setBucketPolicyArgs = SetBucketPolicyArgs.builder().bucket(minioBucket).config(bucketPolicy).build();
        minioClient.setBucketPolicy(setBucketPolicyArgs);
        log.info("Created new bucket '" + minioBucket + "'");
    }

    @SneakyThrows
    private ObjectWriteResponse uploadObject(Path filepath, String key) {
        val contentType = Files.probeContentType(filepath);
        val absolutePathString = filepath.toAbsolutePath().toString();
        val args = UploadObjectArgs.builder().bucket(minioBucket).object(key).filename(absolutePathString)
                .contentType(contentType).build();
        val response = minioClient.uploadObject(args);
        log.info("Uploaded new object '" + key + "' to bucket '" + minioBucket + "'");
        return response;
    }
}
