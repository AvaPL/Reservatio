package com.ziwg.reservatio.controllers;

import com.ziwg.reservatio.entity.Customer;
import com.ziwg.reservatio.entity.Employee;
import com.ziwg.reservatio.entity.Reservation;
import com.ziwg.reservatio.entity.Service;
import com.ziwg.reservatio.pojos.ReservationToAdd;
import com.ziwg.reservatio.repository.ReservationRepository;
import com.ziwg.reservatio.repository.ServiceRepository;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("${spring.data.rest.base-path}")
public class ReservationController {
    private final ReservationRepository _reservationRepository;
    private final ServiceRepository _serviceRepository;

    public ReservationController(ReservationRepository reservationRepository, ServiceRepository serviceRepository)
    {
        _reservationRepository = reservationRepository;
        _serviceRepository = serviceRepository;
    }

    @PostMapping("addReservation")
    public ResponseEntity<HttpStatus> AddReservation(@RequestBody ReservationToAdd reservationToAdd)
    {
        if (reservationToAdd.getCustomerId().equals(null))
        {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (reservationToAdd.getEmployeeId().equals(null))
        {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (reservationToAdd.getServiceId().equals(null))
        {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Customer customer = Customer.builder().id(reservationToAdd.getCustomerId()).build();
        Service service = Service.builder().id(reservationToAdd.getServiceId()).build();
        Employee employee = Employee.builder().id(reservationToAdd.getEmployeeId()).build();
        Reservation reservation = Reservation.builder().customer(customer).service(service).employee(employee).build();
        _reservationRepository.save(reservation);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
