package com.ziwg.reservatio.entity;

import com.sun.istack.NotNull;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
public class Reservation {

    @Id
    @GeneratedValue
    private Long id;
    @NotNull
    private LocalDateTime dateTime;

    @OneToOne
    private Review review;

    @ManyToOne
    private Customer customer;

    @ManyToOne
    private Service service;

    @ManyToOne
    private ServiceProvider serviceProvider;

    @ManyToOne
    private Employee employee;

}
