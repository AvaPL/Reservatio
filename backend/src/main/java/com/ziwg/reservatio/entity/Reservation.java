package com.ziwg.reservatio.entity;

import com.sun.istack.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE, force = true)
@RequiredArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private final LocalDateTime dateTime;

    @ManyToOne
    private final Customer customer;

    @ManyToOne
    private final Service service;

    @ManyToOne
    private final Employee employee;
}
