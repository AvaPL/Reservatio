package com.ziwg.reservatio.images;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.hateoas.RepresentationModel;

@Data
@EqualsAndHashCode(callSuper = true)
public class ImageModel extends RepresentationModel<ImageModel> {
    private final String name;
}
