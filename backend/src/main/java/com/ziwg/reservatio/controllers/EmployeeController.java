package com.ziwg.reservatio.controllers;

import com.ziwg.reservatio.entity.Employee;
import com.ziwg.reservatio.entity.Service;
import com.ziwg.reservatio.entity.ServiceProvider;
import com.ziwg.reservatio.pojos.EmployeeToAdd;
import com.ziwg.reservatio.pojos.EmployeeToDelete;
import com.ziwg.reservatio.repository.EmployeeRepository;
import com.ziwg.reservatio.repository.ServiceProviderRepository;
import com.ziwg.reservatio.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin
@RestController
// TODO: Change path to /service-provider
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

    // TODO: Use email from URL argument instead of id
    @PostMapping("addEmployee/{serviceProviderId}")
    public ResponseEntity<HttpStatus> addEmployee(@PathVariable Long serviceProviderId, @RequestBody EmployeeToAdd employeeToAdd) {
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
        // TODO: Should return 201 with created entity
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // TODO: Use email from URL argument instead of id
    @DeleteMapping("deleteEmployee/{serviceProviderId}")
    public ResponseEntity<HttpStatus> deleteEmployee(@PathVariable Long serviceProviderId, @RequestBody EmployeeToDelete employeeToDelete) {
        Optional<Employee> employee = employeeRepository.findByFirstNameAndLastNameAndServiceProviderId(employeeToDelete.getFirstName(), employeeToDelete.getLastName(), serviceProviderId);
        if (employee.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        employeeRepository.delete(employee.get());
        // TODO: Should return 204 or 200 with link to remaining employees endpoint
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

