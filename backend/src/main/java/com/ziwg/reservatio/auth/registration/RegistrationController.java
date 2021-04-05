package com.ziwg.reservatio.auth.registration;

import com.ziwg.reservatio.auth.registration.form.CustomerRegistrationForm;
import com.ziwg.reservatio.auth.role.Roles;
import com.ziwg.reservatio.entity.Customer;
import com.ziwg.reservatio.keycloak.KeycloakClient;
import com.ziwg.reservatio.keycloak.user.SimpleUserRepresentation;
import com.ziwg.reservatio.repository.CustomerRepository;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Controller
@Slf4j
public class RegistrationController {

    private final CustomerRepository customerRepository;
    private final KeycloakClient keycloakClient;

    @Autowired
    public RegistrationController(CustomerRepository customerRepository, KeycloakClient keycloakClient) {
        this.customerRepository = customerRepository;
        this.keycloakClient = keycloakClient;
    }

    @PostMapping("/register-customer")
    public ResponseEntity<?> registerCustomer(@RequestBody CustomerRegistrationForm registrationForm) {
        saveCustomerInDatabase(registrationForm);
        saveCustomerInKeycloak(registrationForm);
        log.info("Registered new customer '" + registrationForm.getEmail() + "'");
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    private void saveCustomerInDatabase(CustomerRegistrationForm registrationForm) {
        val customer = new Customer(registrationForm.getFirstName(), registrationForm.getLastName(), registrationForm
                .getPhoneNumber(), registrationForm.getEmail());
        customerRepository.save(customer);
    }

    private void saveCustomerInKeycloak(CustomerRegistrationForm registrationForm) {
        Set<String> roles = Collections.singleton(Roles.CUSTOMER.getRoleName());
        val userRepresentation = SimpleUserRepresentation.builder().email(registrationForm.getEmail())
                .password(registrationForm.getPassword()).username(registrationForm.getEmail())
                .firstName(registrationForm.getFirstName()).lastName(registrationForm.getLastName()).build();
        keycloakClient.createUser(userRepresentation, roles);
    }

//    @PostMapping("/register-service-provider")
//    public ? registerServiceProvider() {
//
//    }
}
