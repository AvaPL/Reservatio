package com.ziwg.reservatio.entity;

import com.sun.istack.NotNull;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class Employee {

    @Id
    @GeneratedValue
    private Long id;
    @NotNull
    @Column(length = 20)
    private String firstName;
    @NotNull
    @Column(length = 20)
    private String lastName;

    @OneToMany(mappedBy = "employee")
    private List<Reservation> reservations;

    @ManyToOne
    private ServiceProvider serviceProvider;

    @ManyToMany
    @JoinTable(
            name = "employee_service",
            joinColumns = @JoinColumn(name = "employee_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<Service> services;
}
