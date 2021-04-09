package com.ziwg.reservatio.minio;

import io.minio.*;
import io.minio.http.Method;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import lombok.val;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

@Slf4j
@RequiredArgsConstructor
public class MinioUploader {

    private final MinioClient minioClient;
    @Getter
    private final String minioBucket;
    private final String bucketPolicy;

    public ObjectWriteResponse upload(File file, String key) {
        val filepath = file.toPath();
        return upload(filepath, key);
    }

    public ObjectWriteResponse upload(Path filepath, String key) {
        createBucketIfNotExists();
        return uploadObject(filepath, key);
    }

    @SneakyThrows
    private void createBucketIfNotExists() {
        val args = BucketExistsArgs.builder().bucket(minioBucket).build();
        val bucketExists = minioClient.bucketExists(args);
        if (!bucketExists) {
            log.info("Bucket '" + minioBucket + "' does not exist");
            makeBucket();
        }
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
        logObjectUploaded(key);
        return response;
    }

    private void logObjectUploaded(String key) {
        log.info("Uploaded new object '" + key + "' to bucket '" + minioBucket + "'");
    }

    @SneakyThrows
    public ObjectWriteResponse upload(InputStream inputStream, String key, String contentType) {
        createBucketIfNotExists();
        val args = PutObjectArgs.builder().bucket(minioBucket).object(key).stream(inputStream, -1, 10 * 1024 * 1024)
                .contentType(contentType).build();
        val response = minioClient.putObject(args);
        logObjectUploaded(key);
        return response;
    }

    @SneakyThrows
    public String urlFor(String key) {
        val args = GetPresignedObjectUrlArgs.builder().method(Method.GET).bucket(minioBucket).object(key).build();
        val urlWithExpiry = minioClient.getPresignedObjectUrl(args);
        return urlWithExpiry.split("\\?", 2)[0];
    }
}
