package com.ziwg.reservatio.testdata;

import com.ziwg.reservatio.entity.*;
import com.ziwg.reservatio.minio.MinioUploader;
import com.ziwg.reservatio.repository.*;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
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
    public CommandLineRunner initDatabase(@Value("#{new Boolean('${reservatio.load-test-data}')}") Boolean loadTestData) {
        return args -> {
            if (loadTestData) {
                fillCustomers();
                fillAddresses();
                fillServiceProviders();
                fillServices();
                fillEmployees();
                fillReservations();
                fillReviews();
                joinEmployeesAndServices();
            }
        };
    }

    private void fillCustomers() {
        Random random = new Random();
        for (int i = 1; i <= LoadTestData.numberOfCustomers; i++) {
            int randomPhoneNumber = 100000000 + random.nextInt(900000000);
            val customer = Customer.builder().firstName("name" + i).lastName("lastname" + i)
                    .phoneNumber("+48" + randomPhoneNumber).email("customer" + i + "@gmail.com").build();
            customerRepository.save(customer);
            log.info("Loaded test customer '" + customer.getFirstName() + " " + customer.getLastName() + "'");
        }
    }

    private void fillAddresses() {
        for (int i = 1; i <= LoadTestData.numberOfServiceProviders; i++) {
            val address = Address.builder().street("street" + i).propertyNumber(String.valueOf(i)).city("city" + i)
                    .postCode("00-" + ThreadLocalRandom.current().nextInt(100, 999 + 1)).build();
            addressRepository.save(address);
            log.info("Loaded test address '" + address.getStreet() + " " + address.getPropertyNumber() + ", " +
                    address.getPostCode() + " " + address.getCity() + "'");
        }
    }

    @SneakyThrows
    private void fillServiceProviders() {
        Iterator<Address> addressIterator = addressRepository.findAll().iterator();
        for (int i = 1; i <= LoadTestData.numberOfServiceProviders; i++) {
            if (!addressIterator.hasNext())
                addressIterator = addressRepository.findAll().iterator();

            val serviceProvider = ServiceProvider.builder().email("serviceprovider" + i + "@gmail.com")
                    .name("serviceprovider" + i).phoneNumber("+48" + String.format("%-" + 9 + "s", i).replace(" ", "0"))
                    .address(addressIterator.next()).build();
            val filename = serviceProvider.getName() + ".jpg";
            try (val imageStream = imageFromResources(filename)) {
                minioUploader.upload(imageStream, filename, "image/jpeg");
                serviceProvider.setImageUrl(minioUploader.urlFor(filename));
            }
            serviceProviderRepository.save(serviceProvider);
            log.info("Loaded test service provider '" + serviceProvider.getName() + "'");
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
            val service = Service.builder().name("service" + i).price((float) i).duration(i * 10)
                    .description("description" + i).serviceProvider(serviceProviderIterator.next()).build();
            serviceRepository.save(service);
            log.info("Loaded test service '" + service.getName() + "'");
        }
    }

    private void fillEmployees() {
        Iterator<ServiceProvider> serviceProviderIterator = serviceProviderRepository.findAll().iterator();
        for (int i = 1; i <= LoadTestData.numberOfEmployees; i++) {
            if (!serviceProviderIterator.hasNext())
                serviceProviderIterator = serviceProviderRepository.findAll().iterator();
            val employee = Employee.builder().firstName("employee" + i).lastName("lastname" + i)
                    .serviceProvider(serviceProviderIterator.next()).build();
            employeeRepository.save(employee);
            log.info("Loaded test employee '" + employee.getFirstName() + " " + employee.getLastName() + "'");
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
            val reservation = Reservation.builder().dateTime(LocalDateTime.now()).customer(customerIterator.next())
                    .service(serviceIterator.next()).employee(employeeIterator.next()).build();
            reservationRepository.save(reservation);
            log.info("Loaded test reservation 'ID " + reservation.getId() + " (" + reservation.getDateTime() + ")'");
        }
    }

    private void fillReviews() {
        Iterator<Reservation> reservationIterator = reservationRepository.findAll().iterator();
        for (int i = 1; i <= numberOfReviews; i++) {
            if (!reservationIterator.hasNext())
                reservationIterator = reservationRepository.findAll().iterator();
            Reservation reservation = reservationIterator.next();
            Review review = Review.builder().grade(i).message("review" + i).reservation(reservation).build();
            reservation.setReview(review);
            reviewRepository.save(review);
            log.info("Loaded test review '" + review.getMessage() + "'");
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
                log.info("Linked test employee '" + employee.getFirstName() + " " +
                        employee.getLastName() + "' with test service '" + service.getName() + "'");
            }
        }
    }
}
