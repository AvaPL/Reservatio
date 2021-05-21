package com.ziwg.reservatio.controllers;

import com.ziwg.reservatio.entity.Address;
import com.ziwg.reservatio.entity.ServiceProvider;
import com.ziwg.reservatio.helpers.RawQueryMapper;
import com.ziwg.reservatio.repository.ServiceProviderFields;
import com.ziwg.reservatio.repository.ServiceProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("${spring.data.rest.base-path}")
public class ServiceProviderController {
    private final ServiceProviderRepository serviceProviderRepository;

    @Autowired
    public ServiceProviderController(ServiceProviderRepository serviceProviderRepository) {
        this.serviceProviderRepository = serviceProviderRepository;
    }

    @GetMapping("serviceProvider/{serviceProviderId}")
    public ResponseEntity<ServiceProvider> getServiceProvider(@PathVariable Long serviceProviderId) {
        Optional<ServiceProviderFields> serviceProvider = serviceProviderRepository.getById(serviceProviderId);

        if(serviceProvider.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity(serviceProvider, HttpStatus.OK);
    }
}
