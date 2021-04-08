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
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Column(length = 100)
    private final String name;
    @NotNull
    @Column
    private final Float price;
    @NotNull
    @Column
    private final Integer duration;
    @Column(length = 500)
    private final String description;

    @OneToMany(mappedBy = "service")
    private List<Reservation> reservations;

    @ManyToOne
    private final ServiceProvider serviceProvider;

    @ManyToMany(mappedBy = "services", fetch = FetchType.EAGER)
    private List<Employee> employees = new ArrayList<>();
}
