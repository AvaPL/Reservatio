package com.ziwg.reservatio.auth.registration;

import com.ziwg.reservatio.auth.registration.form.CustomerRegistrationForm;
import com.ziwg.reservatio.auth.registration.form.ServiceProviderRegistrationForm;
import com.ziwg.reservatio.auth.roles.Roles;
import com.ziwg.reservatio.entity.Address;
import com.ziwg.reservatio.entity.Customer;
import com.ziwg.reservatio.entity.ServiceProvider;
import com.ziwg.reservatio.keycloak.KeycloakClient;
import com.ziwg.reservatio.keycloak.user.SimpleUserRepresentation;
import com.ziwg.reservatio.repository.AddressRepository;
import com.ziwg.reservatio.repository.CustomerRepository;
import com.ziwg.reservatio.repository.ServiceProviderRepository;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Collections;
import java.util.Set;

@Controller
@Slf4j
public class RegistrationController {

    private static final String ENTITY_ID_ATTRIBUTE_KEY = "entity_id";

    private final CustomerRepository customerRepository;
    private final AddressRepository addressRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final KeycloakClient keycloakClient;

    @Autowired
    public RegistrationController(CustomerRepository customerRepository, AddressRepository addressRepository,
                                  ServiceProviderRepository serviceProviderRepository, KeycloakClient keycloakClient) {
        this.customerRepository = customerRepository;
        this.addressRepository = addressRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.keycloakClient = keycloakClient;
    }

    @PostMapping("/register-customer")
    public ResponseEntity<?> registerCustomer(@RequestBody CustomerRegistrationForm registrationForm) {
        val customer = saveCustomerInDatabase(registrationForm);
        saveCustomerInKeycloak(registrationForm, customer.getId());
        log.info("Registered new customer '" + registrationForm.getFirstName() + " " +
                registrationForm.getLastName() + " <" + registrationForm.getEmail() + ">'");
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    private Customer saveCustomerInDatabase(CustomerRegistrationForm registrationForm) {
        val customer = new Customer(registrationForm.getFirstName(), registrationForm.getLastName(), registrationForm
                .getPhoneNumber(), registrationForm.getEmail());
        return customerRepository.save(customer);
    }

    private void saveCustomerInKeycloak(CustomerRegistrationForm registrationForm, Long entityId) {
        Set<String> roles = Collections.singleton(Roles.CUSTOMER.getKeycloakRoleName());
        val userRepresentation = SimpleUserRepresentation.builder().email(registrationForm.getEmail())
                .password(registrationForm.getPassword()).username(registrationForm.getEmail())
                .firstName(registrationForm.getFirstName()).lastName(registrationForm.getLastName())
                .attribute(ENTITY_ID_ATTRIBUTE_KEY, entityId.toString()).build();
        keycloakClient.createUser(userRepresentation, roles);
    }

    @PostMapping("/register-service-provider")
    public ResponseEntity<?> registerServiceProvider(@RequestBody ServiceProviderRegistrationForm registrationForm) {
        val serviceProvider = saveServiceProviderInDatabase(registrationForm);
        saveServiceProviderInKeycloak(registrationForm, serviceProvider.getId());
        log.info("Registered new service provider '" + registrationForm.getName() + " <" +
                registrationForm.getEmail() + ">'");
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    private ServiceProvider saveServiceProviderInDatabase(ServiceProviderRegistrationForm registrationForm) {
        val address = new Address(registrationForm.getStreet(), registrationForm.getPropertyNumber(), registrationForm
                .getCity(), registrationForm.getPostCode());
        val savedAddress = addressRepository.save(address);
        val serviceProvider = new ServiceProvider(registrationForm.getEmail(), registrationForm
                .getName(), registrationForm.getPhoneNumber(), savedAddress);
        return serviceProviderRepository.save(serviceProvider);
    }

    private void saveServiceProviderInKeycloak(ServiceProviderRegistrationForm registrationForm, Long entityId) {
        Set<String> roles = Collections.singleton(Roles.SERVICE_PROVIDER.getKeycloakRoleName());
        val userRepresentation = SimpleUserRepresentation.builder().email(registrationForm.getEmail())
                .password(registrationForm.getPassword()).username(registrationForm.getName())
                .attribute(ENTITY_ID_ATTRIBUTE_KEY, entityId.toString()).build();
        keycloakClient.createUser(userRepresentation, roles);
    }
}
