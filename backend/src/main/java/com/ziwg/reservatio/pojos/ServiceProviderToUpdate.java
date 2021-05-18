package com.ziwg.reservatio.pojos;

import lombok.Data;

@Data
public class ServiceProviderToUpdate {

    private String name;
    private String phone_nr;
    private String email;
    private String street;
    private String property_nr;
    private String city;
    private String post_code;
}
