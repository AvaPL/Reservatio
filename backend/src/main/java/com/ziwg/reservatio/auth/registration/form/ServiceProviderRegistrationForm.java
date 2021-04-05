package com.ziwg.reservatio.auth.registration.form;

import lombok.Data;

@Data
public class ServiceProviderRegistrationForm {
    private String name;
    private String email;
    private String phoneNumber;
    private String city;
    private String postCode;
    private String street;
    private String propertyNumber;
    private String password;
}
