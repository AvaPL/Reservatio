package com.ziwg.reservatio.entity;

import com.sun.istack.NotNull;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class ServiceProvider {

    @Id
    @GeneratedValue
    private Long id;
    @NotNull
    @Column(unique = true)
    private String email;

    @OneToMany(mappedBy = "serviceProvider")
    private List<Service> services;

    @OneToMany(mappedBy = "serviceProvider")
    private List<Reservation> reservations;

    @OneToMany(mappedBy = "serviceProvider")
    private List<Employee> employees;
}
