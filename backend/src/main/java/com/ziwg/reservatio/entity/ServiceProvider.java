package com.ziwg.reservatio.entity;

import com.sun.istack.NotNull;
import lombok.*;

import javax.persistence.*;
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

    @Column(length = 5)
    private Integer openTimeInSeconds;
    @Column(length = 5)
    private Integer closeTimeInSeconds;

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
