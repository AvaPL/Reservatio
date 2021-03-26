package com.ziwg.reservatio.images;

import com.ziwg.reservatio.minio.MinioUploader;
import io.minio.ObjectWriteResponse;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.MediaTypes;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Optional;

@Controller
@RequestMapping("${spring.data.rest.base-path}/images")
@Slf4j
public class ExampleImageUploadController {

    private final MinioUploader minioUploader;

    @Autowired
    public ExampleImageUploadController(MinioUploader minioUploader) {
        this.minioUploader = minioUploader;
    }

    @PostMapping(produces = MediaTypes.HAL_JSON_VALUE)
    @SneakyThrows
    public ResponseEntity<ImageModel> upload(@RequestParam("image") MultipartFile file) {
        val filename = Optional.ofNullable(file.getOriginalFilename()).orElse("");
        val tempFile = File.createTempFile("reservatio", filename);
        file.transferTo(tempFile);
        val response = minioUploader.upload(tempFile, filename);
        return toImageModelResponse(response);
    }

    private ResponseEntity<ImageModel> toImageModelResponse(ObjectWriteResponse response) {
        val name = response.object();
        val url = minioUploader.urlFor(name);
        val selfLink = Link.of(url, IanaLinkRelations.SELF);
        val imageModel = new ImageModel(name).add(selfLink);
        return ResponseEntity.created(selfLink.toUri()).body(imageModel);
    }
}
