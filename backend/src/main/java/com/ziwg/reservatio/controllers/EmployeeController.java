package com.ziwg.reservatio.controllers;

import com.ziwg.reservatio.entity.Employee;
import com.ziwg.reservatio.entity.Reservation;
import com.ziwg.reservatio.entity.Service;
import com.ziwg.reservatio.entity.ServiceProvider;
import com.ziwg.reservatio.pojos.EmployeePojo;
import com.ziwg.reservatio.repository.*;
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
    private final ServiceEmployeeViewRepository serviceEmployeeViewRepository;
    private final ServiceProviderEmployeeViewRepository serviceProviderEmployeeViewRepository;
    private final ReservationRepository reservationRepository;

    @Autowired
    public EmployeeController(EmployeeRepository employeeRepository,
                              ServiceProviderRepository serviceProviderRepository,
                              ServiceEmployeeViewRepository serviceEmployeeViewRepository,
                              ServiceProviderEmployeeViewRepository serviceProviderEmployeeViewRepository,
                              ReservationRepository reservationRepository) {
        this.employeeRepository = employeeRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.serviceEmployeeViewRepository = serviceEmployeeViewRepository;
        this.serviceProviderEmployeeViewRepository = serviceProviderEmployeeViewRepository;
        this.reservationRepository = reservationRepository;
    }

    @GetMapping("employeesByService/{serviceId}")
    public ResponseEntity<List<Employee>> getEmployeesByService(@PathVariable Long serviceId) {
        List<Long> serviceEmployeeView = serviceEmployeeViewRepository.findByServiceId(serviceId);
        if (serviceEmployeeView.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        List<Employee> employeeList = new ArrayList<>();

        for (Long employeeId: serviceEmployeeView) {
                List<ReservationFields> reservationFields = reservationRepository.findByEmployeeId(employeeId);
                List<Reservation> reservationList = new ArrayList<>();
                for(ReservationFields reservationField: reservationFields){
                    reservationList.add(Reservation.builder()
                                        .id(reservationField.getId())
                                        .dateTime(reservationField.getDateTime())
                                        .service(Service.builder().durationMinutes(reservationField.getService().getDurationMinutes()).build())
                                        .build());
                }
                Optional<Employee> optionalEmployee = employeeRepository.findById(employeeId);
                Employee employee = Employee.builder()
                                    .id(optionalEmployee.get().getId())
                                    .firstName(optionalEmployee.get().getFirstName())
                                    .lastName(optionalEmployee.get().getLastName())
                                    .reservations(reservationList)
                                    .build();

                employeeList.add(employee);
        }
        if (employeeList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(employeeList, HttpStatus.OK);
    }

    @GetMapping("employeesByServiceProvider")
    public ResponseEntity<List<Employee>> getEmployeesByServiceProvider(@PathVariable Long serviceProviderId) {
        List<Long> serviceProviderEmployeeView = serviceProviderEmployeeViewRepository.findByServiceProviderId(serviceProviderId);
        if (serviceProviderEmployeeView.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        List<Employee> employeeList = new ArrayList<>();

        for (Long id: serviceProviderEmployeeView) {
            List<ReservationFields> reservationFields = reservationRepository.findByEmployeeId(id);
            List<Reservation> reservationList = new ArrayList<>();
            for(ReservationFields reservationField: reservationFields){
                reservationList.add(Reservation.builder()
                        .id(reservationField.getId())
                        .dateTime(reservationField.getDateTime())
                        .service(Service.builder().durationMinutes(reservationField.getService().getDurationMinutes())
                                .name(reservationField.getService().getName())
                                .priceUsd(reservationField.getService().getPriceUsd()).build()).build());
            }
            Optional<Employee> optionalEmployee = employeeRepository.findById(id);
            Employee employee = Employee.builder()
                    .id(optionalEmployee.get().getId())
                    .firstName(optionalEmployee.get().getFirstName())
                    .lastName(optionalEmployee.get().getLastName())
                    .reservations(reservationList)
                    .build();

            employeeList.add(employee);
        }
        if (employeeList.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(employeeList, HttpStatus.OK);
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

