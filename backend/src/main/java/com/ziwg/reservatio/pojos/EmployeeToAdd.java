package com.ziwg.reservatio.pojos;

import lombok.Data;

import java.util.List;

@Data
public class EmployeeToAdd {

    private String firstName;
    private String lastName;
    private List<String> services;
}
