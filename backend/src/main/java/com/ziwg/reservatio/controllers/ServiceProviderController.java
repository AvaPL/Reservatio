package com.ziwg.reservatio.controllers;

import com.ziwg.reservatio.entity.Address;
import com.ziwg.reservatio.entity.ServiceProvider;
import com.ziwg.reservatio.minio.MinioUploader;
import com.ziwg.reservatio.pojos.ServiceProviderToUpdate;
import com.ziwg.reservatio.repository.AddressRepository;
import com.ziwg.reservatio.repository.ServiceProviderFields;
import com.ziwg.reservatio.repository.ServiceProviderRepository;
import lombok.SneakyThrows;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalTime;
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

    @GetMapping("serviceProvider/{serviceProviderId}")
    public ResponseEntity<ServiceProvider> getServiceProvider(@PathVariable Long serviceProviderId) {
        Optional<ServiceProviderFields> serviceProvider = serviceProviderRepository.getById(serviceProviderId);

        if(serviceProvider.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity(serviceProvider, HttpStatus.OK);
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

        String[] openHour = serviceProviderToUpdate.getOpen_hour().split(":");
        String[] closeHour = serviceProviderToUpdate.getClose_hour().split(":");
        LocalTime openHourLT = LocalTime.of(Integer.parseInt(openHour[0].replaceFirst("^0+(?!$)", "")), Integer.parseInt(openHour[1].replaceFirst("^0+(?!$)", "")), 0);
        LocalTime closeHourLT = LocalTime.of(Integer.parseInt(closeHour[0].replaceFirst("^0+(?!$)", "")), Integer.parseInt(closeHour[1].replaceFirst("^0+(?!$)", "")), 0);

        if (openHourLT.isAfter(closeHourLT))
        {
            LocalTime pom = openHourLT;
            openHourLT = closeHourLT;
            closeHourLT = pom;
        }

        serviceProviderToEdit.get().setOpenHours(openHourLT);
        serviceProviderToEdit.get().setCloseHours(closeHourLT);

        serviceProviderRepository.save(serviceProviderToEdit.get());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("uploadImage/{serviceProviderId}")
    @SneakyThrows
    public ResponseEntity<HttpStatus> uploadImage(@PathVariable Long serviceProviderId, @RequestParam("image") MultipartFile file) {
        Optional<ServiceProvider> serviceProviderToEdit = serviceProviderRepository.findById(serviceProviderId);
        if (serviceProviderToEdit.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        val filename = Optional.ofNullable(file.getOriginalFilename()).orElse("");
        try (val inputStream = file.getInputStream()) {
            minioUploader.upload(inputStream, filename, file.getContentType());
        }
        serviceProviderToEdit.get().setImageUrl(minioUploader.urlFor(filename));

        serviceProviderRepository.save(serviceProviderToEdit.get());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
