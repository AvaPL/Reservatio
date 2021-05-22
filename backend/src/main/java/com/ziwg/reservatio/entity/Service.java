package com.ziwg.reservatio.entity;

import com.sun.istack.NotNull;
import com.ziwg.reservatio.views.reservation.ServiceProvidersView;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(exclude = {"serviceProvider", "employees"})
@Builder
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Column(length = 100)
    private String name;
    @NotNull
    @Column
    private Float priceUsd;
    @NotNull
    @Column
    private Integer durationMinutes;
    @Column(length = 500)
    private String description;

    @OneToMany(mappedBy = "service")
    @Singular
    private List<Reservation> reservations;

    @ManyToOne
    private ServiceProvider serviceProvider;

    @ManyToMany(mappedBy = "services", fetch = FetchType.EAGER)
    @Singular
    private List<Employee> employees;
}

