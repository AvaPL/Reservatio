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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
// TODO Change path to /service-provider/{serviceProviderId} (?)
@RequestMapping("${spring.data.rest.base-path}")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;
    private final ServiceProviderRepository serviceProviderRepository;

    @Autowired
    public EmployeeController(EmployeeRepository employeeRepository,
                              ServiceProviderRepository serviceProviderRepository) {
        this.employeeRepository = employeeRepository;
        this.serviceProviderRepository = serviceProviderRepository;
    }

    @PostMapping("addEmployee/{serviceProviderId}")
    public ResponseEntity<HttpStatus> addEmployee(@PathVariable Long serviceProviderId,
                                                  @RequestBody EmployeeToAdd employeeToAdd) {
        Optional<ServiceProvider> serviceProvider = serviceProviderRepository.findById(serviceProviderId);
        if (serviceProvider.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        Employee employee = Employee.builder().firstName(employeeToAdd.getFirstName()).lastName(employeeToAdd.getLastName()).serviceProvider(serviceProvider.get()).build();
        List<String> serviceProviderServices = serviceProvider.get().getServices().stream().map(Service::getName).collect(Collectors.toList());
        if (!serviceProviderServices.containsAll(employeeToAdd.getServices()))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        List<Service> servicesToAdd = serviceProvider.get().getServices().stream().filter(service -> employeeToAdd.getServices().contains(service.getName())).collect(Collectors.toList());
        employee.setServices(servicesToAdd);
        employeeRepository.save(employee);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("deleteEmployee/{employeeId}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long employeeId) {
        Optional<Employee> employeeToDelete = employeeRepository.findById(employeeId);
        if (employeeToDelete.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (employeeToDelete.get().getReservations().stream().anyMatch(reservation -> reservation.getDateTime().isAfter(LocalDateTime.now())))
            return new ResponseEntity<>("Cannot delete an employee that has upcoming appointments", HttpStatus.BAD_REQUEST);
        ServiceProvider serviceProvider = employeeToDelete.get().getServiceProvider();
        serviceProvider.setEmployees(serviceProvider.getEmployees().stream().filter(employee -> !employee.getId().equals(employeeId)).collect(Collectors.toList()));
        serviceProviderRepository.save(serviceProvider);
        employeeToDelete.get().setServiceProvider(null);
        employeeToDelete.get().setServices(new ArrayList<>());
        employeeRepository.save(employeeToDelete.get());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

