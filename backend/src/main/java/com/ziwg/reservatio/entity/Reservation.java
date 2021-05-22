package com.ziwg.reservatio.entity;

import com.sun.istack.NotNull;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@EqualsAndHashCode(exclude = {"customer", "service", "employee"})
@Builder
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private LocalDateTime dateTime;

    @OneToOne
    @PrimaryKeyJoinColumn
    private Review review;

    @ManyToOne
    private Customer customer;

    @ManyToOne
    private Service service;

    @ManyToOne
    private Employee employee;
}