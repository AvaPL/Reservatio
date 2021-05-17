package com.ziwg.reservatio.controllers;

import com.ziwg.reservatio.entity.Employee;
import com.ziwg.reservatio.entity.Service;
import com.ziwg.reservatio.entity.ServiceProvider;
import com.ziwg.reservatio.pojos.ServicePojo;
import com.ziwg.reservatio.repository.EmployeeRepository;
import com.ziwg.reservatio.repository.ServiceProviderRepository;
import com.ziwg.reservatio.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
// TODO Change base path to /serviceProvider/{serviceProviderId} (?)
@RequestMapping("${spring.data.rest.base-path}")
public class ServiceController {

    private final ServiceProviderRepository serviceProviderRepository;
    private final ServiceRepository serviceRepository;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public ServiceController(ServiceProviderRepository serviceProviderRepository, ServiceRepository serviceRepository
            , EmployeeRepository employeeRepository) {
        this.serviceProviderRepository = serviceProviderRepository;
        this.serviceRepository = serviceRepository;
        this.employeeRepository = employeeRepository;
    }

    @PostMapping("addService/{serviceProviderId}")
    public ResponseEntity<HttpStatus> addService(@PathVariable Long serviceProviderId,
                                                 @RequestBody ServicePojo servicePojo) {
        Optional<ServiceProvider> serviceProvider = serviceProviderRepository.findById(serviceProviderId);
        if (serviceProvider.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        Service service = Service.builder().name(servicePojo.getName()).description(servicePojo.getDescription())
                .priceUsd(servicePojo.getPriceUsd()).durationMinutes(servicePojo.getDurationMinutes())
                .serviceProvider(serviceProvider.get()).build();
        List<String> serviceProviderEmployees = serviceProvider.get().getEmployees().stream()
                .map(employee -> employee.getFirstName() + " " + employee.getLastName()).collect(Collectors.toList());
        if (!serviceProviderEmployees.containsAll(servicePojo.getEmployees()))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        List<Employee> employeesToAdd = serviceProvider.get().getEmployees().stream()
                .filter(employee -> servicePojo.getEmployees()
                        .contains(employee.getFirstName() + " " + employee.getLastName())).collect(Collectors.toList());
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

    @DeleteMapping("deleteService/{serviceId}")
    public ResponseEntity<String> deleteService(@PathVariable Long serviceId) {
        Optional<Service> serviceToDelete = serviceRepository.findById(serviceId);
        if (serviceToDelete.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        if (serviceToDelete.get().getReservations().stream()
                .anyMatch(reservation -> reservation.getDateTime().isAfter(LocalDateTime.now())))
            return new ResponseEntity<>("Cannot delete a service assigned to upcoming appointments",
                    HttpStatus.BAD_REQUEST);
        ServiceProvider serviceProvider = serviceToDelete.get().getServiceProvider();
        serviceProvider
                .setServices(serviceProvider.getServices().stream().filter(service -> service.getId().equals(serviceId))
                        .collect(Collectors.toList()));
        serviceProviderRepository.save(serviceProvider);
        serviceToDelete.get().setServiceProvider(null);
        deleteServiceFromEmployees(serviceToDelete.get());
        serviceRepository.save(serviceToDelete.get());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private void deleteServiceFromEmployees(Service serviceToDelete) {
        for (Employee employee : serviceToDelete.getEmployees()) {
            employee.setServices(employee.getServices().stream()
                    .filter(service -> !service.getId().equals(serviceToDelete.getId())).collect(Collectors.toList()));
            employeeRepository.save(employee);
        }
    }

    @PutMapping("editService/{serviceId}")
    public ResponseEntity<HttpStatus> editService(@PathVariable Long serviceId, @RequestBody ServicePojo servicePojo) {
        Optional<Service> serviceToEdit = serviceRepository.findById(serviceId);
        if (serviceToEdit.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        updateService(serviceToEdit.get(), servicePojo);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private void updateService(Service serviceToEdit, ServicePojo servicePojo) {
        serviceToEdit.setName(servicePojo.getName());
        serviceToEdit.setDescription(servicePojo.getDescription());
        serviceToEdit.setPriceUsd(servicePojo.getPriceUsd());
        serviceToEdit.setDurationMinutes(servicePojo.getDurationMinutes());
        serviceRepository.save(serviceToEdit);
        deleteServiceFromEmployees(serviceToEdit);
        List<Employee> employees = serviceToEdit.getServiceProvider().getEmployees();
        List<Employee> newEmployees = employees.stream().filter(employee -> servicePojo.getEmployees()
                .contains(employee.getFirstName() + " " + employee.getLastName())).collect(Collectors.toList());
        addServiceToEmployees(serviceToEdit, newEmployees);
    }
}
