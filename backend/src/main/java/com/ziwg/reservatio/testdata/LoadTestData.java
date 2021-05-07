package com.ziwg.reservatio.testdata;

import com.github.javafaker.Faker;
import com.google.common.collect.Lists;
import com.google.common.collect.Streams;
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
                val serviceProviders = fillServiceProviders();
                val employees = fillEmployees(serviceProviders);
                val services = fillServices(serviceProviders, employees);
                val customers = fillCustomers();
                val reservations = fillReservations(Lists.newArrayList(customers), Lists.newArrayList(services));
                fillReviews(Lists.newArrayList(reservations));
            }
        };
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

    private Iterable<Employee> fillEmployees(Iterable<ServiceProvider> serviceProviders) {
        val result = new ArrayList<Employee>();
        for (val serviceProvider : serviceProviders) {
            val count = employeesPerProviderCount();
            for (int i = 0; i < count; i++) {
                val employee = fakeEmployee(serviceProvider);
                result.add(employee);
                log.info("Loaded test employee '" + employee.getFirstName() + " " + employee.getLastName() + "'");
            }
        }
        return employeeRepository.saveAll(result);
    }

    private Employee fakeEmployee(ServiceProvider serviceProvider) {
        return Employee.builder().firstName(faker.name().firstName()).lastName(faker.name().lastName())
                .serviceProvider(serviceProvider).build();
    }

    // TODO: Cleanup
    private Iterable<Service> fillServices(Iterable<ServiceProvider> serviceProviders, Iterable<Employee> employees) {
        val result = new ArrayList<Service>();
        for (val serviceProvider : serviceProviders) {
            val servicesCount = servicesPerProviderCount();
            val providerServices = new ArrayList<Service>();
            for (int i = 0; i < servicesCount; i++) {
                val service = fakeService(serviceProvider);
                providerServices.add(service);
                log.info("Loaded test service '" + service.getName() + "'");
            }
            val serviceProviderEmployees = Streams.stream(employees)
                    .filter(e -> e.getServiceProvider().equals(serviceProvider)).collect(Collectors.toList());
            for (val employee : serviceProviderEmployees) {
                val servicesPerEmployee = servicesPerEmployeeCount();
                for (int i = 0; i < servicesPerEmployee; i++) {
                    val randomService = random(providerServices);
//                    randomService.getEmployees().add(employee); // TODO: Find a way to join employees and services.
                    log.info("Linked test employee '" + employee.getFirstName() + " " + employee
                            .getLastName() + "' with test service '" + randomService.getName() + "'");
                }
            }
            result.addAll(providerServices);
        }
        return serviceRepository.saveAll(result);
    }

    private <T> T random(List<T> list) {
        return list.get(faker.random().nextInt(list.size()));
    }

    private Service fakeService(ServiceProvider serviceProvider) {
        return Service.builder().name(faker.company().catchPhrase())
                .priceUsd(Float.parseFloat(faker.commerce().price()))
                .durationMinutes(faker.number().numberBetween(1, 7) * 10)
                .description(StringUtils.left(faker.shakespeare().hamletQuote(), 500)).serviceProvider(serviceProvider)
                .build();
    }

    private Iterable<Customer> fillCustomers() {
        val result = new ArrayList<Customer>();
        val count = customersCount();
        for (int i = 0; i < count; i++) {
            val customer = fakeCustomer();
            result.add(customer);
            log.info("Loaded test customer '" + customer.getFirstName() + " " + customer.getLastName() + "'");
        }
        return customerRepository.saveAll(result);
    }

    private Customer fakeCustomer() {
        return Customer.builder().firstName(faker.name().firstName()).lastName(faker.name().lastName())
                .phoneNumber(faker.phoneNumber().cellPhone()).email(faker.internet().emailAddress()).build();
    }

//    private void fillAddresses() {
//        for (int i = 1; i <= LoadTestData.numberOfServiceProviders; i++) {
//            val address = Address.builder().street("street" + i).propertyNumber(String.valueOf(i)).city("city" + i)
//                    .postCode("00-" + ThreadLocalRandom.current().nextInt(100, 999 + 1)).build();
//            addressRepository.save(address);
//            log.info("Loaded test address '" + address.getStreet() + " " + address.getPropertyNumber() + ", " +
//                    address.getPostCode() + " " + address.getCity() + "'");
//        }
//    }

    private InputStream imageFromResources(String filename) {
        return getClass().getClassLoader().getResourceAsStream("images" + File.separator + filename);
    }


    private Iterable<Reservation> fillReservations(List<Customer> customers, List<Service> services) {
        val result = new ArrayList<Reservation>();
        val count = reservationsCount();
        val servicesWithEmployees = services.stream().filter(s -> !s.getEmployees().isEmpty())
                .collect(Collectors.toList());
        for (int i = 0; i < count; i++) {
            val randomCustomer = random(customers);
            val randomService = random(servicesWithEmployees);
            val randomEmployee = random(randomService.getEmployees());
            val reservation = fakeReservation(randomCustomer, randomService, randomEmployee);
            result.add(reservation);
            log.info("Loaded test reservation 'ID " + reservation.getId() + " (" + reservation.getDateTime() + ")'");
        }
        return reservationRepository.saveAll(result);
    }

    private Reservation fakeReservation(Customer randomCustomer, Service randomService, Employee randomEmployee) {
        return Reservation.builder()
                .dateTime(faker.date().past(14, TimeUnit.DAYS).toInstant().atZone(ZoneId.systemDefault())
                        .toLocalDateTime()).customer(randomCustomer).service(randomService).employee(randomEmployee)
                .build();
    }

    private Iterable<Review> fillReviews(List<Reservation> reservations) {
        val result = new ArrayList<Review>();
        val count = reviewsCount();
        for (int i = 0; i < count; i++) {
            val randomReservation = random(reservations);
            val review = fakeReview(randomReservation);
            result.add(review);
            log.info("Loaded test review '" + review.getMessage() + "'");
        }
        return reviewRepository.saveAll(result);
    }

    private Review fakeReview(Reservation randomReservation) {
        return Review.builder().grade(faker.number().numberBetween(1, 6))
                .message(StringUtils.left(faker.shakespeare().hamletQuote(), 2000)).reservation(randomReservation)
                .build();
    }

//    private void joinEmployeesAndServices() {
//        Iterator<Service> serviceIterator = serviceRepository.findAll().iterator();
//        for (Employee employee : employeeRepository.findAll()) {
//            for (int i = 0; i < numberOfServicesPerEmployee; i++) {
//                if (!serviceIterator.hasNext())
//                    serviceIterator = serviceRepository.findAll().iterator();
//                Service service = serviceIterator.next();
//                employee.getServices().add(service);
//                service.getEmployees().add(employee);
//                serviceRepository.save(service);
//            }
//            employeeRepository.save(employee);
//        }
//    }
}
