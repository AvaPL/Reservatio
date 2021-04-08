package com.ziwg.reservatio.entity;

import com.sun.istack.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE, force = true)
@RequiredArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Column(length = 20)
    private final String firstName;
    @NotNull
    @Column(length = 20)
    private final String lastName;
    @NotNull
    @Column(length = 12, unique = true)
    private final String phoneNumber;
    @NotNull
    @Column(unique = true)
    private final String email;

    @OneToMany(mappedBy = "customer")
    private List<Reservation> reservations;

}
