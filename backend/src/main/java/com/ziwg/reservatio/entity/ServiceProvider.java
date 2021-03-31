package com.ziwg.reservatio.entity;

import com.sun.istack.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE, force = true)
@RequiredArgsConstructor
public class ServiceProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Column(unique = true)
    private final String email;
    @NotNull
    @Column(length = 50)
    private final String name;
    @NotNull
    @Column(length = 12, unique = true)
    private final String phoneNumber;
    private String imageUrl;

    @OneToOne
    private final Address address;

    @OneToMany(mappedBy = "serviceProvider")
    private List<Service> services;

    @OneToMany(mappedBy = "serviceProvider")
    private List<Employee> employees;
}
