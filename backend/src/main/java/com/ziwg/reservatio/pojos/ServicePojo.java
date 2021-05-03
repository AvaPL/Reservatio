package com.ziwg.reservatio.pojos;

import lombok.Data;

import java.util.List;

@Data
public class ServicePojo {

    private String name;
    private String description;
    private Float price;
    private Integer duration;
    private List<String> employees;
}
