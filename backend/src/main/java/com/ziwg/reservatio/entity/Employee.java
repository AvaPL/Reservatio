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
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Column(length = 20)
    private String firstName;
    @NotNull
    @Column(length = 20)
    private String lastName;

    @OneToMany(mappedBy = "employee")
    @Singular
    private List<Reservation> reservations;

    @ManyToOne
    private ServiceProvider serviceProvider;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "employee_service",
            joinColumns = @JoinColumn(name = "employee_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    @Singular
    private List<Service> services;
}
