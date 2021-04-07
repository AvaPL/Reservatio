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
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("deleteEmployee/{serviceProviderId}")
    public ResponseEntity<HttpStatus> deleteEmployee(@PathVariable Long serviceProviderId, @RequestBody EmployeeToDelete employeeToDelete) {
        String[] splitName = employeeToDelete.getName().split("\\s+");
        Optional<Employee> employee = employeeRepository.findByFirstNameAndLastNameAndServiceProviderId(splitName[0], splitName[1], serviceProviderId);
        if (employee.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        employeeRepository.delete(employee.get());
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

