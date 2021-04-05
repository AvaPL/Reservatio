package com.ziwg.reservatio.auth.registration.form;

import lombok.Data;

@Data
public class CustomerRegistrationForm {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String password;
}
