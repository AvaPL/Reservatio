package com.ziwg.reservatio.controllers;

import com.ziwg.reservatio.entity.Customer;
import com.ziwg.reservatio.entity.Employee;
import com.ziwg.reservatio.entity.Service;
import com.ziwg.reservatio.entity.ServiceProvider;
import com.ziwg.reservatio.repository.*;
import org.keycloak.authorization.client.util.Http;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("${spring.data.rest.base-path}")
public class CustomerController {
    private final CustomerRepository customerRepository;
    private final ServiceProviderRepository serviceProviderRepository;

    @Autowired
    public CustomerController(ServiceProviderRepository serviceProviderRepository, CustomerRepository customerRepository){
        this.customerRepository = customerRepository;
        this.serviceProviderRepository = serviceProviderRepository;
    }

    @PostMapping("addFavourite/{customerId}/{serviceProviderId}")
    public ResponseEntity<HttpStatus> addFavourite(@PathVariable Long customerId, @PathVariable Long serviceProviderId) {
        Optional<Customer> customer = customerRepository.findById(customerId);
        if (customer.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        Optional<ServiceProvider> serviceProvider = serviceProviderRepository.findById(serviceProviderId);
        if (serviceProvider.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        customer.get().getFavourites().add(serviceProvider.get());
        customerRepository.save(customer.get());
        serviceProviderRepository.save(serviceProvider.get());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("deleteFavourite/{customerId}/{serviceProviderId}")
    public ResponseEntity<HttpStatus> deleteFavourite(@PathVariable Long customerId, @PathVariable Long serviceProviderId) {
        Optional<Customer> customer = customerRepository.findById(customerId);
        if (customer.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        Optional<ServiceProvider> serviceProvider = serviceProviderRepository.findById(serviceProviderId);
        if (serviceProvider.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        customer.get().setFavourites(customer.get().getFavourites().stream().filter(favourite -> !favourite.getId().equals(serviceProviderId)).collect(Collectors.toList()));
        customerRepository.save(customer.get());
        serviceProvider.get().setCustomers(serviceProvider.get().getCustomers().stream().filter(customer1 -> !customer1.getId().equals(customerId)).collect(Collectors.toList()));
        serviceProviderRepository.save(serviceProvider.get());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
