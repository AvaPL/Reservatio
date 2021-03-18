package com.ziwg.reservatio.entity;

import com.sun.istack.NotNull;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class Customer {

    @Id
    @GeneratedValue
    private Long id;
    @NotNull
    @Column(length = 20)
    private String firstName;
    @NotNull
    @Column(length = 20)
    private String lastName;
    @NotNull
    @Column(length = 12)
    private String phoneNumber;
    @NotNull
    @Column(length = 45)
    private String email;

    @OneToMany(mappedBy = "customer")
    private List<Reservation> reservations;

}
