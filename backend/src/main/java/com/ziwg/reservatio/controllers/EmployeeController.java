package com.ziwg.reservatio.controllers;

import com.ziwg.reservatio.entity.Employee;
import com.ziwg.reservatio.entity.Service;
import com.ziwg.reservatio.entity.ServiceProvider;
import com.ziwg.reservatio.pojos.EmployeePojo;
import com.ziwg.reservatio.repository.EmployeeRepository;
import com.ziwg.reservatio.repository.ServiceProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("${spring.data.rest.base-path}/serviceProvider/{serviceProviderId}/employees")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;
    private final ServiceProviderRepository serviceProviderRepository;

    @Autowired
    public EmployeeController(EmployeeRepository employeeRepository,
                              ServiceProviderRepository serviceProviderRepository) {
        this.employeeRepository = employeeRepository;
        this.serviceProviderRepository = serviceProviderRepository;
    }

    @PostMapping
    public ResponseEntity<String> addEmployee(@PathVariable Long serviceProviderId,
                                                  @RequestBody EmployeePojo employeePojo) {
        Optional<ServiceProvider> serviceProvider = serviceProviderRepository.findById(serviceProviderId);
        if (serviceProvider.isEmpty())
            return new ResponseEntity<>("Wrong service provider id", HttpStatus.BAD_REQUEST);
        Employee employee = createEmployee(employeePojo, serviceProvider.get());
        List<String> serviceProviderServicesNames = getServiceProviderServicesNames(serviceProvider.get());
        if (!serviceProviderServicesNames.containsAll(employeePojo.getServices()))
            return new ResponseEntity<>("Wrong services", HttpStatus.BAD_REQUEST);
        setServicesForEmployee(employeePojo, employee);
        employeeRepository.save(employee);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    private Employee createEmployee(EmployeePojo employeePojo, ServiceProvider serviceProvider) {
        return Employee.builder().firstName(employeePojo.getFirstName()).lastName(employeePojo.getLastName()).serviceProvider(serviceProvider).build();
    }

    private List<String> getServiceProviderServicesNames(ServiceProvider serviceProvider) {
        return serviceProvider.getServices().stream().map(Service::getName).collect(Collectors.toList());
    }

    private void setServicesForEmployee(EmployeePojo employeePojo, Employee employee) {
        List<Service> servicesToAdd = getServicesToAdd(employeePojo, employee.getServiceProvider());
        employee.setServices(servicesToAdd);
    }

    private List<Service> getServicesToAdd(EmployeePojo employeePojo, ServiceProvider serviceProvider) {
        return serviceProvider.getServices().stream().filter(service -> new HashSet<>(employeePojo.getServices()).contains(service.getName())).collect(Collectors.toList());
    }

    @DeleteMapping("{employeeId}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long serviceProviderId, @PathVariable Long employeeId) {
        Optional<ServiceProvider> serviceProvider = serviceProviderRepository.findById(serviceProviderId);
        if (serviceProvider.isEmpty())
            return new ResponseEntity<>("Wrong service provider id", HttpStatus.BAD_REQUEST);
        Optional<Employee> employeeToDelete = getEmployeeFromServiceProvider(employeeId, serviceProvider.get());
        if (employeeToDelete.isEmpty())
            return new ResponseEntity<>("Wrong employee id", HttpStatus.BAD_REQUEST);
        if (hasAnyUpcomingReservations(employeeToDelete.get()))
            return new ResponseEntity<>("Cannot delete an employee that has upcoming appointments", HttpStatus.BAD_REQUEST);
        deleteEmployeeFromServiceProvider(employeeId, serviceProvider.get());
        clearRelationsInEmployee(employeeToDelete.get());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private Optional<Employee> getEmployeeFromServiceProvider(Long employeeId, ServiceProvider serviceProvider) {
        return serviceProvider.getEmployees().stream().filter(employee -> employee.getId().equals(employeeId)).findAny();
    }

    private boolean hasAnyUpcomingReservations(Employee employeeToDelete) {
        return employeeToDelete.getReservations().stream().anyMatch(reservation -> reservation.getDateTime().isAfter(LocalDateTime.now()));
    }

    private void deleteEmployeeFromServiceProvider(Long employeeId, ServiceProvider serviceProvider) {
        serviceProvider.setEmployees(getEmployeesWithoutEmployee(employeeId, serviceProvider));
        serviceProviderRepository.save(serviceProvider);
    }

    private List<Employee> getEmployeesWithoutEmployee(Long employeeId, ServiceProvider serviceProvider) {
        return serviceProvider.getEmployees().stream().filter(employee -> !employee.getId().equals(employeeId)).collect(Collectors.toList());
    }

    private void clearRelationsInEmployee(Employee employeeToDelete) {
        employeeToDelete.setServiceProvider(null);
        employeeToDelete.setServices(new ArrayList<>());
        employeeRepository.save(employeeToDelete);
    }

    @PutMapping("{employeeId}")
    public ResponseEntity<String> editEmployee(@PathVariable Long serviceProviderId, @PathVariable Long employeeId, @RequestBody EmployeePojo employeePojo) {
        Optional<ServiceProvider> serviceProvider = serviceProviderRepository.findById(serviceProviderId);
        if (serviceProvider.isEmpty())
            return new ResponseEntity<>("Wrong service provider id", HttpStatus.BAD_REQUEST);
        Optional<Employee> employeeToEdit = getEmployeeFromServiceProvider(employeeId, serviceProvider.get());
        if (employeeToEdit.isEmpty())
            return new ResponseEntity<>("Wrong employee id", HttpStatus.BAD_REQUEST);
        updateEmployee(employeeToEdit.get(), employeePojo);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private void updateEmployee(Employee employeeToEdit, EmployeePojo employeePojo) {
        employeeToEdit.setFirstName(employeePojo.getFirstName());
        employeeToEdit.setLastName(employeePojo.getLastName());
        setServicesForEmployee(employeePojo, employeeToEdit);
        employeeRepository.save(employeeToEdit);
    }
}

