package com.ziwg.reservatio.testdata;

import com.github.javafaker.Faker;
import com.ziwg.reservatio.entity.*;
import com.ziwg.reservatio.minio.MinioUploader;
import com.ziwg.reservatio.repository.*;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Configuration
@Slf4j
public class LoadTestData {

    private static final Faker faker = new Faker();

    private static int serviceProvidersCount() {
        return faker.number().numberBetween(3, 5);
    }

    private static int servicesPerProviderCount() {
        return faker.number().numberBetween(5, 10);
    }

    private static int employeesPerProviderCount() {
        return faker.number().numberBetween(4, 6);
    }

    private static int servicesPerEmployeeCount() {
        return faker.number().numberBetween(1, 3);
    }

    private static int numberOfCustomersCount() {
        return faker.number().numberBetween(15, 25);
    }

    private static int numberOfReservationsCount() {
        return faker.number().numberBetween(10, 20);
    }

    private static int numberOfReviewsCount() {
        return faker.number().numberBetween(10, 20);
    }

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
                fillAddresses();
                val serviceProviders = fillServiceProviders();
                val employees = fillEmployees(serviceProviders);
                val services = fillServices(employees);
                fillCustomers();
                fillReservations();
                fillReviews();
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
    private Iterable<ServiceProvider> fillServiceProviders() {
        val count = serviceProvidersCount();
        val addresses = new ArrayList<Address>();
        val serviceProviders = new ArrayList<ServiceProvider>();
        for (int i = 0; i < count; i++) {
            val address = fakeAddress();
            val serviceProvider = fakeServiceProvider(address);
            // TODO: Add images
//            val filename = serviceProvider.getName() + ".jpg";
//            try (val imageStream = imageFromResources(filename)) {
//                minioUploader.upload(imageStream, filename, "image/jpeg");
//                serviceProvider.setImageUrl(minioUploader.urlFor(filename));
//            }
            addresses.add(address);
            serviceProviders.add(serviceProvider);
            log.info("Loaded test service provider '" + serviceProvider.getName() + "'");
        }
        addressRepository.saveAll(addresses);
        return serviceProviderRepository.saveAll(serviceProviders);
    }

    private Address fakeAddress() {
        return Address.builder().street(faker.address().streetName()).propertyNumber(faker.address().buildingNumber())
                .city(faker.address().city()).postCode(faker.address().zipCode()).build();
    }

    private ServiceProvider fakeServiceProvider(Address address) {
        return ServiceProvider.builder().email(faker.internet().emailAddress()).name(faker.company().name())
                .phoneNumber(faker.phoneNumber().phoneNumber()).address(address).build();
    }

    private InputStream imageFromResources(String filename) {
        return getClass().getClassLoader().getResourceAsStream("images" + File.separator + filename);
    }

    // TODO: Cleanup
    private Iterable<Service> fillServices(List<Employee> employees) {
        val result = new ArrayList<Service>();
        val serviceProviders = employees.stream().map(Employee::getServiceProvider).collect(Collectors.toList());
        for (val serviceProvider : serviceProviders) {
            val servicesCount = servicesPerProviderCount();
            val providerServices = new ArrayList<Service>();
            for (int i = 0; i < servicesCount; i++) {
                val service = fakeService(serviceProvider);
                providerServices.add(service);
                log.info("Loaded test service '" + service.getName() + "'");
            }
            for (val employee : serviceProvider.getEmployees()) {
                val servicesPerEmployee = servicesPerEmployeeCount();
                for (int i = 0; i < servicesPerEmployee; i++) {
                    val randomService = providerServices.get(faker.random().nextInt(providerServices.size()));
                    employee.getServices().add(randomService);
                    randomService.getEmployees().add(employee);
                    log.info("Linked test employee '" + employee.getFirstName() + " " + employee
                            .getLastName() + "' with test service '" + randomService.getName() + "'");
                }
            }
        }
        val savedEntities = serviceRepository.saveAll(result);
        employeeRepository.saveAll(employees);
        return savedEntities;
    }

    private Service fakeService(ServiceProvider serviceProvider) {
        return Service.builder().name(faker.job().title()).priceUsd(Float.parseFloat(faker.commerce().price()))
                .durationMinutes(faker.number().numberBetween(1, 7) * 10)
                .description(StringUtils.left(faker.shakespeare().hamletQuote(), 500)).serviceProvider(serviceProvider)
                .build();
    }

    private List<Employee> fillEmployees(Iterable<ServiceProvider> serviceProviders) {
        val result = new ArrayList<Employee>();
        for (val serviceProvider : serviceProviders) {
            val count = employeesPerProviderCount();
            for (int i = 0; i < count; i++) {
                val employee = fakeEmployee(serviceProvider);
                val savedEntity = employeeRepository.save(employee);
                result.add(savedEntity);
                log.info("Loaded test employee '" + savedEntity.getFirstName() + " " + savedEntity.getLastName() + "'");
            }
        }
        return result;
    }

    private Employee fakeEmployee(ServiceProvider serviceProvider) {
        return Employee.builder().firstName(faker.name().firstName()).lastName(faker.name().lastName())
                .serviceProvider(serviceProvider).build();
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
            }
            employeeRepository.save(employee);
        }
    }
}
