package com.ziwg.reservatio.controllers;

import com.ziwg.reservatio.entity.Customer;
import com.ziwg.reservatio.entity.Employee;
import com.ziwg.reservatio.entity.Reservation;
import com.ziwg.reservatio.entity.Service;
import com.ziwg.reservatio.pojos.ReservationToAddPojo;
import com.ziwg.reservatio.pojos.ReservationToReservePojo;
import com.ziwg.reservatio.repository.ReservationRepository;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("${spring.data.rest.base-path}")
public class ReservationController {
    private final ReservationRepository _reservationRepository;

    public ReservationController(ReservationRepository reservationRepository) {
        _reservationRepository = reservationRepository;
    }

    @PostMapping("reservation/")
    public ResponseEntity<HttpStatus> AddReservation(@RequestBody ReservationToAddPojo reservationToAdd) {
        Employee employee = Employee.builder().id(reservationToAdd.getEmployeeId()).build();
        Reservation reservation = Reservation.builder().employee(employee).dateTime(reservationToAdd.getDateTime()).build();
        _reservationRepository.save(reservation);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("getReservation/{serviceId}")
    public ResponseEntity<List<Reservation>> GetReservation(@PathVariable Long serviceId) {
        List<Reservation> foundReservations = _reservationRepository.findByServiceId(serviceId);

        if (foundReservations.isEmpty()){
            return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(foundReservations, HttpStatus.FOUND);
    }

    @DeleteMapping("reservation/{reservationId}")
    public ResponseEntity<HttpStatus> DeleteReservation(@PathVariable Long reservationId) {
        _reservationRepository.deleteById(reservationId);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("bookReservation/{reservationId}")
    public ResponseEntity<HttpStatus> ReserveReservation(@PathVariable Long reservationId,
                                                         @RequestBody ReservationToReservePojo reservationToReserve) {
        Optional<Reservation> reservationToEdit = _reservationRepository.findById(reservationId);
        if (reservationToEdit.isEmpty()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        updateReservationConsumer(reservationToEdit.get(), reservationToReserve);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("cancelReservation/{reservationId}")
    public ResponseEntity<HttpStatus> CancelReservation(@PathVariable Long reservationId) {
        Optional<Reservation> reservationToEdit = _reservationRepository.findById(reservationId);
        if (reservationToEdit.isEmpty()){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        updateReservationConsumer(reservationToEdit.get());

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private void updateReservationConsumer(Reservation reservationToEdit, ReservationToReservePojo reservationToReserve) {
        reservationToEdit.setCustomer(Customer.builder().id(reservationToReserve.getCustomerId()).build());
        reservationToEdit.setService(Service.builder().id(reservationToReserve.getServiceId()).build());
        _reservationRepository.save(reservationToEdit);
    }

    private void updateReservationConsumer(Reservation reservationToEdit) {
        reservationToEdit.setCustomer(null);
        reservationToEdit.setService(null);
        _reservationRepository.save(reservationToEdit);
    }
}
