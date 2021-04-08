package com.ziwg.reservatio.testdata;

import com.ziwg.reservatio.entity.*;
import com.ziwg.reservatio.minio.MinioUploader;
import com.ziwg.reservatio.repository.*;
import lombok.SneakyThrows;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.Iterator;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;


@Configuration
public class LoadTestData {

    private static final int numberOfCustomers = 20;
    private static final int numberOfServiceProviders = 3;
    private static final int numberOfServices = 10;
    private static final int numberOfEmployees = 20;
    private static final int numberOfReservations = 10;
    private static final int numberOfReviews = 5;
    private static final int numberOfServicesPerEmployee = 2;

    private final CustomerRepository customerRepository;
    private final AddressRepository addressRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final ServiceRepository serviceRepository;
    private final EmployeeRepository employeeRepository;
    private final ReservationRepository reservationRepository;
    private final ReviewRepository reviewRepository;
    private final MinioUploader minioUploader;

    @Autowired
    public LoadTestData(CustomerRepository customerRepository, AddressRepository addressRepository,
                        ServiceProviderRepository serviceProviderRepository, EmployeeRepository employeeRepository,
                        ServiceRepository serviceRepository, ReservationRepository reservationRepository,
                        ReviewRepository reviewRepository, MinioUploader minioUploader) {
        this.customerRepository = customerRepository;
        this.addressRepository = addressRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.employeeRepository = employeeRepository;
        this.serviceRepository = serviceRepository;
        this.reservationRepository = reservationRepository;
        this.reviewRepository = reviewRepository;
        this.minioUploader = minioUploader;
    }

    @Bean
    public CommandLineRunner initDatabase(@Value("${reservatio.loadTestData}") String loadData) {
        if (Boolean.parseBoolean(loadData)) {
            return args -> {
                fillCustomers();
                fillAddresses();
                fillServiceProviders();
                fillServices();
                fillEmployees();
                fillReservations();
                fillReviews();
                joinEmployeesAndServices();
            };
        }
        return args -> {
        };
    }

    private void fillCustomers() {
        Random random = new Random();
        for (int i = 1; i <= LoadTestData.numberOfCustomers; i++) {
            int randomPhoneNumber = 100000000 + random.nextInt(900000000);
            customerRepository.save(new Customer("name" + i,
                    "lastname" + i,
                    "+48" + randomPhoneNumber,
                    "customer" + i + "@gmail.com"));
        }
    }

    private void fillAddresses() {
        for (int i = 1; i <= LoadTestData.numberOfServiceProviders; i++) {
            addressRepository.save(new Address("street" + i,
                    String.valueOf(i),
                    "city" + i,
                    "00-" + ThreadLocalRandom.current().nextInt(100, 999 + 1)));
        }
    }

    @SneakyThrows
    private void fillServiceProviders() {
        Iterator<Address> addressIterator = addressRepository.findAll().iterator();
        for (int i = 1; i <= LoadTestData.numberOfServiceProviders; i++) {
            if (!addressIterator.hasNext())
                addressIterator = addressRepository.findAll().iterator();

            ServiceProvider serviceProvider = new ServiceProvider("serviceprovider" + i + "@gmail.com",
                    "serviceprovider" + i,
                    "+48" + String.format("%-" + 9 + "s", i).replace(" ", "0"),
                    addressIterator.next());
            val filename = serviceProvider.getName() + ".jpg";
            try (val imageStream = imageFromResources(filename)) {
                minioUploader.upload(imageStream, filename, "image/jpeg");
                serviceProvider.setImageUrl(minioUploader.urlFor(filename));
            }
            serviceProviderRepository.save(serviceProvider);
        }
    }

    private InputStream imageFromResources(String filename) {
        return getClass().getClassLoader().getResourceAsStream("images" + File.separator + filename);
    }

    private void fillServices() {
        Iterator<ServiceProvider> serviceProviderIterator = serviceProviderRepository.findAll().iterator();
        for (int i = 1; i <= LoadTestData.numberOfServices; i++) {
            if (!serviceProviderIterator.hasNext())
                serviceProviderIterator = serviceProviderRepository.findAll().iterator();
            serviceRepository.save(new Service("service" + i,
                    (float) i,
                    i * 10,
                    "description" + i,
                    serviceProviderIterator.next()));
        }
    }

    private void fillEmployees() {
        Iterator<ServiceProvider> serviceProviderIterator = serviceProviderRepository.findAll().iterator();
        for (int i = 1; i <= LoadTestData.numberOfEmployees; i++) {
            if (!serviceProviderIterator.hasNext())
                serviceProviderIterator = serviceProviderRepository.findAll().iterator();
            employeeRepository.save(new Employee("employee" + i,
                    "lastname" + i,
                    serviceProviderIterator.next()));

        }
    }

    private void fillReservations() {
        Iterator<Customer> customerIterator = customerRepository.findAll().iterator();
        Iterator<Service> serviceIterator = serviceRepository.findAll().iterator();
        Iterator<Employee> employeeIterator = employeeRepository.findAll().iterator();
        for (int i = 1; i <= LoadTestData.numberOfReservations; i++) {
            if (!customerIterator.hasNext())
                customerIterator = customerRepository.findAll().iterator();
            if (!serviceIterator.hasNext())
                serviceIterator = serviceRepository.findAll().iterator();
            if (!employeeIterator.hasNext())
                employeeIterator = employeeRepository.findAll().iterator();
            reservationRepository.save(new Reservation(LocalDateTime.now(),
                    customerIterator.next(),
                    serviceIterator.next(),
                    employeeIterator.next()));
        }
    }

    private void fillReviews() {
        Iterator<Reservation> reservationIterator = reservationRepository.findAll().iterator();
        for (int i = 1; i <= numberOfReviews; i++) {
            if (!reservationIterator.hasNext())
                reservationIterator = reservationRepository.findAll().iterator();
            Reservation reservation = reservationIterator.next();
            Review review = new Review(i, "review" + i, reservation);
            reservation.setReview(review);
            reviewRepository.save(review);
            reservationRepository.save(reservation);
        }
    }

    private void joinEmployeesAndServices() {
        Iterator<Service> serviceIterator = serviceRepository.findAll().iterator();
        for (Employee employee : employeeRepository.findAll()) {
            for (int i = 0; i < numberOfServicesPerEmployee; i++) {
                if (!serviceIterator.hasNext())
                    serviceIterator = serviceRepository.findAll().iterator();
                Service service = serviceIterator.next();
                employee.getServices().add(service);
                service.getEmployees().add(employee);
                serviceRepository.save(service);
            }
            employeeRepository.save(employee);
        }
    }
}
