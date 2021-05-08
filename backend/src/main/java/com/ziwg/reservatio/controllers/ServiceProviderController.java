package com.ziwg.reservatio.controllers;

import com.ziwg.reservatio.entity.ServiceProvider;
import com.ziwg.reservatio.entity.Address;
import com.ziwg.reservatio.pojos.ServiceProviderToUpdate;
import com.ziwg.reservatio.repository.ServiceProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("${spring.data.rest.base-path}")
public class ServiceProviderController {

    private final ServiceProviderRepository _serviceProviderRepository;

    @Autowired
    public ServiceProviderController(ServiceProviderRepository serviceProviderRepository){
        this._serviceProviderRepository = serviceProviderRepository;
    }

    @PutMapping("updateServiceProvider/{serviceProviderId}")
    public ResponseEntity<HttpStatus> updateServiceProvider(@PathVariable Long serviceProviderId,
                                                            @RequestBody ServiceProviderToUpdate serviceProviderToUpdate){
        Optional<ServiceProvider> serviceProvider = _serviceProviderRepository.findById(serviceProviderId);
        if (serviceProvider.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        Address address = Address.builder().street(serviceProviderToUpdate.getStreet()).propertyNumber(serviceProviderToUpdate.
                getProperty_nr()).city(serviceProviderToUpdate.getCity()).postCode(serviceProviderToUpdate.getPost_code()).build();
        serviceProvider.get().setName(serviceProviderToUpdate.getName());
        serviceProvider.get().setAddress(address);
        serviceProvider.get().setPhoneNumber(serviceProviderToUpdate.getPhone_nr());
        serviceProvider.get().setEmail(serviceProviderToUpdate.getEmail());

        _serviceProviderRepository.save(serviceProvider.get());
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
