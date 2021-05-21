package com.ziwg.reservatio.entity;

import com.sun.istack.NotNull;
import lombok.*;

import javax.persistence.*;
import java.time.LocalTime;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ServiceProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Column(unique = true)
    private String email;
    @NotNull
    @Column(length = 50)
    private String name;
    @NotNull
    @Column(length = 30, unique = true)
    private String phoneNumber;
    private String imageUrl;

    @NotNull
    @Column(columnDefinition = "TIME default '18:00:00'")
    private LocalTime closeHours;

    @NotNull
    @Column(columnDefinition = "TIME default '10:00:00'")
    private LocalTime openHours;

    @OneToOne
    private Address address;

    @OneToMany(mappedBy = "serviceProvider")
    @Singular
    private List<Service> services;

    @OneToMany(mappedBy = "serviceProvider")
    @Singular
    private List<Employee> employees;

    @ManyToMany(mappedBy = "favourites")
    @Singular
    private List<Customer> customers;
}
