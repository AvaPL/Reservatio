package com.ziwg.reservatio.loadtestdata;

import com.ziwg.reservatio.entity.*;
import com.ziwg.reservatio.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.Collections;

@Slf4j
@Configuration
public class LoadTestData {

    @Bean
    public CommandLineRunner initDatabase(CustomerRepository customerRepository,
                                          AddressRepository addressRepository,
                                          ServiceProviderRepository serviceProviderRepository,
                                          EmployeeRepository employeeRepository,
                                          ServiceRepository serviceRepository,
                                          ReservationRepository reservationRepository) {
        return args -> {
            Customer customer = new Customer("Andrzej", "Ktosiek", "123456789", "andrzej@gmail.com");
            customerRepository.save(customer);
            Address address = new Address("Kwiatowa", "1", "Wroclaw", "50-520");
            addressRepository.save(address);
            ServiceProvider serviceProvider = new ServiceProvider("uBasi@gmail.com", "U Basi", "123456789", address);
            serviceProviderRepository.save(serviceProvider);
            Service service = new Service("Strzyzenie", 50f, 60, "Obcinamy wlosy", serviceProvider);
            serviceRepository.save(service);
            Employee employee = new Employee("Basia", "Fryzjerka", serviceProvider);
            employee.setServices(Collections.singletonList(service));
            employeeRepository.save(employee);
            Reservation reservation = new Reservation(LocalDateTime.now(), customer, service, employee);
            log.info("Preloading " + reservationRepository.save(reservation));
        };
    }
}
