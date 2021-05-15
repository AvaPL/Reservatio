package com.ziwg.reservatio.controllers;

import com.ziwg.reservatio.entity.ServiceProvider;
import com.ziwg.reservatio.entity.Address;
import com.ziwg.reservatio.pojos.ServiceProviderToUpdate;
import com.ziwg.reservatio.repository.AddressRepository;
import com.ziwg.reservatio.repository.ServiceProviderRepository;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ziwg.reservatio.minio.MinioUploader;

import java.io.File;
import java.io.InputStream;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("${spring.data.rest.base-path}")
public class ServiceProviderController {

    private final ServiceProviderRepository serviceProviderRepository;
    private final AddressRepository addressRepository;
    private final MinioUploader minioUploader;

    @Autowired
    public ServiceProviderController(ServiceProviderRepository serviceProviderRepository, AddressRepository addressRepository, MinioUploader minioUploader){
        this.serviceProviderRepository = serviceProviderRepository;
        this.addressRepository = addressRepository;
        this.minioUploader = minioUploader;
    }

    @PutMapping("updateServiceProvider/{serviceProviderId}")
    public ResponseEntity<HttpStatus> updateServiceProvider(@PathVariable Long serviceProviderId,
                                                            @RequestBody ServiceProviderToUpdate serviceProviderToUpdate){
        Optional<ServiceProvider> serviceProviderToEdit = serviceProviderRepository.findById(serviceProviderId);
        if (serviceProviderToEdit.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        Address address = Address.builder().street(serviceProviderToUpdate.getStreet()).propertyNumber(serviceProviderToUpdate.
                getProperty_nr()).city(serviceProviderToUpdate.getCity()).postCode(serviceProviderToUpdate.getPost_code()).build();
        addressRepository.save(address);
        serviceProviderToEdit.get().setName(serviceProviderToUpdate.getName());
        serviceProviderToEdit.get().setAddress(address);
        serviceProviderToEdit.get().setPhoneNumber(serviceProviderToUpdate.getPhone_nr());
        serviceProviderToEdit.get().setEmail(serviceProviderToUpdate.getEmail());

        serviceProviderRepository.save(serviceProviderToEdit.get());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private InputStream imageFromResources(String filename) {
        return getClass().getClassLoader().getResourceAsStream("images" + File.separator + filename);
    }
}
