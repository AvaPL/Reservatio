package com.ziwg.reservatio.entity;

import com.sun.istack.NotNull;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class Service {

    @Id
    @GeneratedValue
    private Long id;
    @NotNull
    @Column(length = 100)
    private String name;
    @NotNull
    @Column
    private Float price;
    @NotNull
    @Column
    private Integer duration;
    @Column(length = 500)
    private String description;

    @OneToMany(mappedBy = "service")
    private List<Reservation> reservations;

    @ManyToOne
    private ServiceProvider serviceProvider;
    @ManyToMany(mappedBy = "services")
    private List<Employee> employees;
}
