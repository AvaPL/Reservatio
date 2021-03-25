package com.ziwg.reservatio.images;

import com.ziwg.reservatio.minio.MinioUploader;
import lombok.SneakyThrows;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Optional;

@Controller
@RequestMapping("/images")
public class ExampleImageUploadController {

    private final MinioUploader minioUploader;

    @Autowired
    public ExampleImageUploadController(MinioUploader minioUploader) {
        this.minioUploader = minioUploader;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    @SneakyThrows
    public void upload(@RequestParam("file") MultipartFile file) {
        val filename = Optional.ofNullable(file.getOriginalFilename()).orElse("");
        val tempFile = File.createTempFile("reservatio", filename);
        file.transferTo(tempFile);
        minioUploader.upload(tempFile, filename);
    }
}
