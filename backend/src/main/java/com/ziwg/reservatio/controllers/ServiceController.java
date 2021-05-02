package com.ziwg.reservatio.controllers;

import com.ziwg.reservatio.entity.Employee;
import com.ziwg.reservatio.entity.Service;
import com.ziwg.reservatio.entity.ServiceProvider;
import com.ziwg.reservatio.pojos.ServiceToAdd;
import com.ziwg.reservatio.repository.EmployeeRepository;
import com.ziwg.reservatio.repository.ServiceProviderRepository;
import com.ziwg.reservatio.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("${spring.data.rest.base-path}")
public class ServiceController {

    private final ServiceProviderRepository serviceProviderRepository;
    private final ServiceRepository serviceRepository;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public ServiceController(ServiceProviderRepository serviceProviderRepository, ServiceRepository serviceRepository, EmployeeRepository employeeRepository) {
        this.serviceProviderRepository = serviceProviderRepository;
        this.serviceRepository = serviceRepository;
        this.employeeRepository = employeeRepository;
    }

    @PostMapping("addService/{serviceProviderId}")
    public ResponseEntity<HttpStatus> addService(@PathVariable Long serviceProviderId, @RequestBody ServiceToAdd serviceToAdd) {
        Optional<ServiceProvider> serviceProvider = serviceProviderRepository.findById(serviceProviderId);
        if (serviceProvider.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        Service service = Service.builder().name(serviceToAdd.getName()).description(serviceToAdd.getDescription()).price(serviceToAdd.getPrice()).duration(serviceToAdd.getDuration()).serviceProvider(serviceProvider.get()).build();
        List<String> serviceProviderEmployees = serviceProvider.get().getEmployees().stream().map(employee -> employee.getFirstName() + " " + employee.getLastName()).collect(Collectors.toList());
        if (!serviceProviderEmployees.containsAll(serviceToAdd.getEmployees()))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        List<Employee> employeesToAdd = serviceProvider.get().getEmployees().stream().filter(employee -> serviceToAdd.getEmployees().contains(employee.getFirstName() + " " + employee.getLastName())).collect(Collectors.toList());
        service.setEmployees(employeesToAdd);
        serviceRepository.save(service);
        addServiceToEmployees(service, employeesToAdd);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    private void addServiceToEmployees(Service service, List<Employee> employeesToAdd) {
        for (Employee employee : employeesToAdd) {
            employee.getServices().add(service);
            employeeRepository.save(employee);
        }
    }
}
