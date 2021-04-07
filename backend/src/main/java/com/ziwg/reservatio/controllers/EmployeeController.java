package com.ziwg.reservatio.controllers;

import com.ziwg.reservatio.entity.Employee;
import com.ziwg.reservatio.entity.Service;
import com.ziwg.reservatio.entity.ServiceProvider;
import com.ziwg.reservatio.pojos.EmployeeToAdd;
import com.ziwg.reservatio.repository.EmployeeRepository;
import com.ziwg.reservatio.repository.ServiceProviderRepository;
import com.ziwg.reservatio.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(methods = RequestMethod.POST)
@RestController
@RequestMapping("${spring.data.rest.base-path}")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final ServiceRepository serviceRepository;

    @Autowired
    public EmployeeController(EmployeeRepository employeeRepository, ServiceProviderRepository serviceProviderRepository, ServiceRepository serviceRepository) {
        this.employeeRepository = employeeRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.serviceRepository = serviceRepository;
    }

    @PostMapping("addEmployee/{serviceProviderId}")
    public ResponseEntity<Object> addEmployee(@PathVariable Long serviceProviderId, @RequestBody EmployeeToAdd employeeToAdd) {
        Optional<ServiceProvider> serviceProvider = serviceProviderRepository.findById(serviceProviderId);
        if (serviceProvider.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        Employee employee = new Employee(employeeToAdd.getFirstName(), employeeToAdd.getLastName(), serviceProvider.get());
        for (String serviceName : employeeToAdd.getServices()) {
            Optional<Service> service = serviceRepository.findByNameAndServiceProviderId(serviceName, serviceProviderId);
            if (service.isEmpty())
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            employee.getServices().add(service.get());
        }
        employeeRepository.save(employee);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
