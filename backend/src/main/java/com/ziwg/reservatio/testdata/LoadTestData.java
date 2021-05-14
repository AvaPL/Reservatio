package com.ziwg.reservatio.testdata;

import com.github.javafaker.Faker;
import com.google.common.collect.Lists;
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
import java.io.IOException;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
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

    private static int customersCount() {
        return faker.number().numberBetween(15, 25);
    }

    private static int reservationsCount() {
        return faker.number().numberBetween(10, 20);
    }

    private static int reviewsCount() {
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
                fillServiceProviderRelatedTables();
                fillCustomerRelatedTables();
            }
        };
    }

    private void fillServiceProviderRelatedTables() {
        val serviceProviders = fillServiceProviders();
        val services = fillServices(serviceProviders);
        fillEmployees(serviceProviders);
        val employees = linkEmployeesAndServices(serviceProviders);
        addressRepository.saveAll(serviceProviders.stream().map(ServiceProvider::getAddress)
                .collect(Collectors.toList()));
        serviceProviderRepository.saveAll(serviceProviders);
        serviceRepository.saveAll(services);
        employeeRepository.saveAll(employees);
    }

    private void fillCustomerRelatedTables() {
        val customers = fillCustomers();
        val reservations = fillReservations(customers, Lists
                .newArrayList(serviceRepository.findAll())); // Also fetches relations of services
        val reviews = fillReviews(reservations);
        customerRepository.saveAll(customers);
        reservationRepository.saveAll(reservations);
        reviewRepository.saveAll(reviews);
    }

    private List<ServiceProvider> fillServiceProviders() {
        val result = new ArrayList<ServiceProvider>();
        val count = serviceProvidersCount();
        for (int i = 0; i < count; i++) {
            val address = fakeAddress();
            val imageUrl = randomImage();
            val serviceProvider = fakeServiceProvider(address, imageUrl);
            result.add(serviceProvider);
            log.info("Loaded test service provider '" + serviceProvider.getName() + "'");
        }
        return result;
    }

    private String randomImage() {
        val imageIndex = faker.number().numberBetween(1, 6);
        val filename = "serviceprovider" + imageIndex + ".jpg";
        val path = "images" + File.separator + filename;
        return uploadToMinio(filename, path);
    }

    @SneakyThrows
    private String uploadToMinio(String filename, String path) {
        try (val imageStream = getClass().getClassLoader().getResourceAsStream(path)) {
            minioUploader.upload(imageStream, filename, "image/jpeg");
            return minioUploader.urlFor(filename);
        }
    }

    private Address fakeAddress() {
        return Address.builder().street(faker.address().streetName()).propertyNumber(faker.numerify("##"))
                .city(faker.address().city()).postCode(faker.numerify("##-###")).build();
    }

    private ServiceProvider fakeServiceProvider(Address address, String imageUrl) {
        return ServiceProvider.builder().email(faker.internet().emailAddress()).name(faker.company().name())
                .phoneNumber(fakePhoneNumber()).address(address).imageUrl(imageUrl).build();
    }

    private String fakePhoneNumber() {
        return faker.regexify("(\\+48)?\\d{9}");
    }

    private List<Employee> fillEmployees(List<ServiceProvider> serviceProviders) {
        for (val serviceProvider : serviceProviders) {
            val count = employeesPerProviderCount();
            val providerEmployees = createEmployees(serviceProvider, count);
            serviceProvider.setEmployees(providerEmployees);
        }
        return serviceProviders.stream().flatMap(sp -> sp.getEmployees().stream()).collect(Collectors.toList());
    }

    private ArrayList<Employee> createEmployees(ServiceProvider serviceProvider, int count) {
        val providerEmployees = new ArrayList<Employee>();
        for (int i = 0; i < count; i++) {
            val employee = fakeEmployee(serviceProvider);
            providerEmployees.add(employee);
            log.info("Loaded test employee '" + employee.getFirstName() + " " + employee.getLastName() + "'");
        }
        return providerEmployees;
    }

    private Employee fakeEmployee(ServiceProvider serviceProvider) {
        return Employee.builder().firstName(faker.name().firstName()).lastName(faker.name().lastName())
                .serviceProvider(serviceProvider).build();
    }

    private List<Service> fillServices(List<ServiceProvider> serviceProviders) {
        for (val serviceProvider : serviceProviders) {
            val count = servicesPerProviderCount();
            final ArrayList<Service> providerServices = createServices(serviceProvider, count);
            serviceProvider.setServices(providerServices);
        }
        return serviceProviders.stream().flatMap(sp -> sp.getServices().stream()).collect(Collectors.toList());
    }

    private ArrayList<Service> createServices(ServiceProvider serviceProvider, int count) {
        val providerServices = new ArrayList<Service>();
        for (int i = 0; i < count; i++) {
            val service = fakeService(serviceProvider);
            providerServices.add(service);
            log.info("Loaded test service '" + service.getName() + "'");
        }
        return providerServices;
    }

    private Service fakeService(ServiceProvider serviceProvider) {
        return Service.builder().name(faker.company().catchPhrase())
                .priceUsd(Float.parseFloat(faker.commerce().price().replaceAll(",",".")))
                .durationMinutes(faker.number().numberBetween(1, 7) * 10)
                .description(StringUtils.left(faker.shakespeare().hamletQuote(), 500)).serviceProvider(serviceProvider)
                .build();
    }

    private List<Employee> linkEmployeesAndServices(List<ServiceProvider> serviceProviders) {
        for (ServiceProvider serviceProvider : serviceProviders) {
            linkServiceProviderEmployeesWithServices(serviceProvider);
        }
        return serviceProviders.stream().flatMap(sp -> sp.getEmployees().stream()).collect(Collectors.toList());
    }

    private void linkServiceProviderEmployeesWithServices(ServiceProvider serviceProvider) {
        for (Employee employee : serviceProvider.getEmployees()) {
            val count = servicesPerEmployeeCount();
            linkEmployeeWithServices(employee, serviceProvider.getServices(), count);
        }
    }

    private void linkEmployeeWithServices(Employee employee, List<Service> services, int count) {
        for (int i = 0; i < count; i++) {
            val randomService = random(services);
            if (!employee.getServices().contains(randomService)) {
                employee.setServices(Lists.asList(randomService, employee.getServices().toArray(new Service[0])));
                log.info("Linked test employee '" + employee.getFirstName() + " " + employee
                        .getLastName() + "' with test service '" + randomService.getName() + "'");
            }
        }
    }

    private <T> T random(List<T> list) {
        return list.get(faker.random().nextInt(list.size()));
    }

    private List<Customer> fillCustomers() {
        val count = customersCount();
        return createCustomers(count);
    }

    private ArrayList<Customer> createCustomers(int count) {
        val result = new ArrayList<Customer>();
        for (int i = 0; i < count; i++) {
            val customer = fakeCustomer();
            result.add(customer);
            log.info("Loaded test customer '" + customer.getFirstName() + " " + customer.getLastName() + "'");
        }
        return result;
    }

    private Customer fakeCustomer() {
        return Customer.builder().firstName(faker.name().firstName()).lastName(faker.name().lastName())
                .phoneNumber(fakePhoneNumber()).email(faker.internet().emailAddress()).build();
    }

    private List<Reservation> fillReservations(List<Customer> customers, List<Service> services) {
        val count = reservationsCount();
        val servicesWithEmployees = services.stream().filter(s -> !s.getEmployees().isEmpty())
                .collect(Collectors.toList());
        return createReservations(customers, servicesWithEmployees, count);
    }

    private ArrayList<Reservation> createReservations(List<Customer> customers, List<Service> servicesWithEmployees,
                                                      int count) {
        val result = new ArrayList<Reservation>();
        for (int i = 0; i < count; i++) {
            val reservation = createReservation(customers, servicesWithEmployees);
            result.add(reservation);
        }
        return result;
    }

    private Reservation createReservation(List<Customer> customers, List<Service> servicesWithEmployees) {
        val randomCustomer = random(customers);
        val randomService = random(servicesWithEmployees);
        val randomEmployee = random(randomService.getEmployees());
        val reservation = fakeReservation(randomCustomer, randomService, randomEmployee);
        log.info("Loaded test reservation for service '" + randomService
                .getName() + "' and customer '" + randomCustomer.getFirstName() + " " + randomCustomer
                .getLastName() + "' on '" + reservation.getDateTime() + "'");
        return reservation;
    }

    private Reservation fakeReservation(Customer randomCustomer, Service randomService, Employee randomEmployee) {
        return Reservation.builder()
                .dateTime(faker.date().past(14, TimeUnit.DAYS).toInstant().atZone(ZoneId.systemDefault())
                        .toLocalDateTime()).customer(randomCustomer).service(randomService).employee(randomEmployee)
                .build();
    }

    private List<Review> fillReviews(List<Reservation> reservations) {
        val count = reviewsCount();
        return createReviews(reservations, count);
    }

    private ArrayList<Review> createReviews(List<Reservation> reservations, int count) {
        val result = new ArrayList<Review>();
        for (int i = 0; i < count; i++) {
            val review = createReview(reservations);
            result.add(review);
        }
        return result;
    }

    private Review createReview(List<Reservation> reservations) {
        val randomReservation = random(reservations);
        val review = fakeReview(randomReservation);
        log.info("Loaded test review '" + review.getMessage() + "'");
        return review;
    }

    private Review fakeReview(Reservation randomReservation) {
        return Review.builder().grade(faker.number().numberBetween(1, 6))
                .message(StringUtils.left(faker.shakespeare().hamletQuote(), 2000)).reservation(randomReservation)
                .build();
    }
}
