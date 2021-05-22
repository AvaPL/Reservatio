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
@RequestMapping("${spring.data.rest.base-path}/serviceProvider/{serviceProviderId}/services")
public class ServiceController {

    private final ServiceProviderRepository serviceProviderRepository;
    private final ServiceRepository serviceRepository;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public ServiceController(ServiceProviderRepository serviceProviderRepository, ServiceRepository serviceRepository,
                             EmployeeRepository employeeRepository) {
        this.serviceProviderRepository = serviceProviderRepository;
        this.serviceRepository = serviceRepository;
        this.employeeRepository = employeeRepository;
    }

    @PostMapping
    public ResponseEntity<String> addService(@PathVariable Long serviceProviderId,
                                                 @RequestBody ServicePojo servicePojo) {
        Optional<ServiceProvider> serviceProvider = serviceProviderRepository.findById(serviceProviderId);
        if (serviceProvider.isEmpty())
            return new ResponseEntity<>("Wrong service provider id", HttpStatus.BAD_REQUEST);
        Service service = createService(servicePojo, serviceProvider.get());
        List<String> serviceProviderEmployees = getServiceProviderEmployeesNames(serviceProvider.get());
        if (!serviceProviderEmployees.containsAll(servicePojo.getEmployees()))
            return new ResponseEntity<>("Wrong employees", HttpStatus.BAD_REQUEST);
        List<Employee> employeesToAdd = getEmployeesToAdd(servicePojo, serviceProvider.get().getEmployees());
        service.setEmployees(employeesToAdd);
        serviceRepository.save(service);
        addServiceToEmployees(service, employeesToAdd);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    private Service createService(ServicePojo servicePojo, ServiceProvider serviceProvider) {
        return Service.builder().name(servicePojo.getName()).description(servicePojo.getDescription())
                .priceUsd(servicePojo.getPriceUsd()).durationMinutes(servicePojo.getDurationMinutes())
                .serviceProvider(serviceProvider).build();
    }

    private List<String> getServiceProviderEmployeesNames(ServiceProvider serviceProvider) {
        return serviceProvider.getEmployees().stream()
                .map(employee -> employee.getFirstName() + " " + employee.getLastName()).collect(Collectors.toList());
    }

    private List<Employee> getEmployeesToAdd(ServicePojo servicePojo, List<Employee> employees) {
        return employees.stream().filter(employee -> servicePojo.getEmployees()
                .contains(employee.getFirstName() + " " + employee.getLastName())).collect(Collectors.toList());
    }

    private void addServiceToEmployees(Service service, List<Employee> employeesToAdd) {
        for (Employee employee : employeesToAdd)
            employee.getServices().add(service);
        employeeRepository.saveAll(employeesToAdd);
    }

    @DeleteMapping("{serviceId}")
    public ResponseEntity<String> deleteService(@PathVariable Long serviceProviderId, @PathVariable Long serviceId) {
        Optional<ServiceProvider> serviceProvider = serviceProviderRepository.findById(serviceProviderId);
        if (serviceProvider.isEmpty())
            return new ResponseEntity<>("Wrong service provider id", HttpStatus.BAD_REQUEST);
        Optional<Service> serviceToDelete = getServiceFromServiceProvider(serviceId, serviceProvider.get());
        if (serviceToDelete.isEmpty())
            return new ResponseEntity<>("Wrong service id", HttpStatus.BAD_REQUEST);
        if (hasAnyUpcomingReservations(serviceToDelete.get()))
            return new ResponseEntity<>("Cannot delete a service assigned to upcoming appointments",
                    HttpStatus.BAD_REQUEST);
        deleteServiceFromServiceProvider(serviceId, serviceProvider.get());
        clearRelationsInService(serviceToDelete.get());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private Optional<Service> getServiceFromServiceProvider(Long serviceId, ServiceProvider serviceProvider) {
        return serviceProvider.getServices().stream().filter(service -> service.getId().equals(serviceId)).findAny();
    }

    private boolean hasAnyUpcomingReservations(Service serviceToDelete) {
        return serviceToDelete.getReservations().stream()
                .anyMatch(reservation -> reservation.getDateTime().isAfter(LocalDateTime.now()));
    }

    private void deleteServiceFromServiceProvider(Long serviceId, ServiceProvider serviceProvider) {
        serviceProvider.setServices(getServicesWithoutService(serviceId, serviceProvider));
        serviceProviderRepository.save(serviceProvider);
    }

    private List<Service> getServicesWithoutService(Long serviceId, ServiceProvider serviceProvider) {
        return serviceProvider.getServices().stream()
                .filter(service -> service.getId().equals(serviceId)).collect(Collectors.toList());
    }

    private void clearRelationsInService(Service serviceToDelete) {
        serviceToDelete.setServiceProvider(null);
        deleteServiceFromEmployees(serviceToDelete);
        serviceRepository.save(serviceToDelete);
    }

    private void deleteServiceFromEmployees(Service serviceToDelete) {
        for (Employee employee : serviceToDelete.getEmployees())
            employee.setServices(employee.getServices().stream()
                    .filter(service -> !service.getId().equals(serviceToDelete.getId())).collect(Collectors.toList()));
        employeeRepository.saveAll(serviceToDelete.getEmployees());
    }

    @PutMapping("{serviceId}")
    public ResponseEntity<String> editService(@PathVariable Long serviceProviderId, @PathVariable Long serviceId,
                                                  @RequestBody ServicePojo servicePojo) {
        Optional<ServiceProvider> serviceProvider = serviceProviderRepository.findById(serviceProviderId);
        if (serviceProvider.isEmpty())
            return new ResponseEntity<>("Wrong service provider id", HttpStatus.BAD_REQUEST);
        Optional<Service> serviceToEdit = getServiceFromServiceProvider(serviceId, serviceProvider.get());
        if (serviceToEdit.isEmpty())
            return new ResponseEntity<>("Wrong service id", HttpStatus.BAD_REQUEST);
        updateService(serviceToEdit.get(), servicePojo);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private void updateService(Service serviceToEdit, ServicePojo servicePojo) {
        updateServiceProperties(serviceToEdit, servicePojo);
        updateServiceEmployees(serviceToEdit, servicePojo);
    }

    private void updateServiceProperties(Service serviceToEdit, ServicePojo servicePojo) {
        serviceToEdit.setName(servicePojo.getName());
        serviceToEdit.setDescription(servicePojo.getDescription());
        serviceToEdit.setPriceUsd(servicePojo.getPriceUsd());
        serviceToEdit.setDurationMinutes(servicePojo.getDurationMinutes());
        serviceRepository.save(serviceToEdit);
    }

    private void updateServiceEmployees(Service serviceToEdit, ServicePojo servicePojo) {
        deleteServiceFromEmployees(serviceToEdit);
        List<Employee> employees = serviceToEdit.getServiceProvider().getEmployees();
        List<Employee> newEmployees = getEmployeesToAdd(servicePojo, employees);
        addServiceToEmployees(serviceToEdit, newEmployees);
    }
}
