package com.ziwg.reservatio.pojos;

import lombok.Data;

import java.util.List;

@Data
public class ServicePojo {

    private String name;
    private String description;
    private Float priceUsd;
    private Integer durationMinutes;
    private List<String> employees;
}
