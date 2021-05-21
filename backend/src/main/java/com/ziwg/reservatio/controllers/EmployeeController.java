package com.ziwg.reservatio.controllers;

import com.ziwg.reservatio.entity.Employee;
import com.ziwg.reservatio.entity.Reservation;
import com.ziwg.reservatio.entity.Service;
import com.ziwg.reservatio.entity.ServiceProvider;
import com.ziwg.reservatio.pojos.EmployeePojo;
import com.ziwg.reservatio.repository.*;
import com.ziwg.reservatio.views.services.ServiceEmployeeView;
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
// TODO Change base path to /serviceProvider/{serviceProviderId} (?)
@RequestMapping("${spring.data.rest.base-path}")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final ServiceEmployeeViewRepository serviceEmployeeViewRepository;
    private final ReservationRepository reservationRepository;

    @Autowired
    public EmployeeController(EmployeeRepository employeeRepository,
                              ServiceProviderRepository serviceProviderRepository,
                              ServiceEmployeeViewRepository serviceEmployeeViewRepository,
                              ReservationRepository reservationRepository) {
        this.employeeRepository = employeeRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.serviceEmployeeViewRepository = serviceEmployeeViewRepository;
        this.reservationRepository = reservationRepository;
    }

    @GetMapping("employeesByService/{serviceId}")
    public ResponseEntity<List<Employee>> getEmployeesByService(@PathVariable Long serviceId) {
        List<Long> serviceEmployeeView = serviceEmployeeViewRepository.findByServiceId(serviceId);
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

    @PostMapping("addEmployee/{serviceProviderId}")
    public ResponseEntity<HttpStatus> addEmployee(@PathVariable Long serviceProviderId,
                                                  @RequestBody EmployeePojo employeePojo) {
        Optional<ServiceProvider> serviceProvider = serviceProviderRepository.findById(serviceProviderId);
        if (serviceProvider.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        Employee employee = Employee.builder().firstName(employeePojo.getFirstName()).lastName(employeePojo.getLastName()).serviceProvider(serviceProvider.get()).build();
        List<String> serviceProviderServices = serviceProvider.get().getServices().stream().map(Service::getName).collect(Collectors.toList());
        if (!serviceProviderServices.containsAll(employeePojo.getServices()))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        List<Service> servicesToAdd = serviceProvider.get().getServices().stream().filter(service -> employeePojo.getServices().contains(service.getName())).collect(Collectors.toList());
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

    @PutMapping("editEmployee/{employeeId}")
    public ResponseEntity<HttpStatus> editEmployee(@PathVariable Long employeeId, @RequestBody EmployeePojo employeePojo) {
        Optional<Employee> employeeToEdit = employeeRepository.findById(employeeId);
        if (employeeToEdit.isEmpty())
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        updateEmployee(employeeToEdit.get(), employeePojo);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private void updateEmployee(Employee employeeToEdit, EmployeePojo employeePojo) {
        employeeToEdit.setFirstName(employeePojo.getFirstName());
        employeeToEdit.setLastName(employeePojo.getLastName());
        List<Service> services = employeeToEdit.getServiceProvider().getServices().stream().filter(service -> employeePojo.getServices().contains(service.getName())).collect(Collectors.toList());
        employeeToEdit.setServices(services);
        employeeRepository.save(employeeToEdit);
    }
}

