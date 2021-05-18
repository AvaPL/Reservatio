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
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Column(length = 50)
    private String firstName;
    @NotNull
    @Column(length = 50)
    private String lastName;
    @NotNull
    @Column(length = 30, unique = true)
    private String phoneNumber;
    @NotNull
    @Column(unique = true)
    private String email;

    @OneToMany(mappedBy = "customer")
    @Singular
    private List<Reservation> reservations;

    @ManyToMany
    @JoinTable(
            name = "favourites",
            joinColumns = @JoinColumn(name = "customer_id"),
            inverseJoinColumns = @JoinColumn(name = "service_provider_id")
    )
    @Singular
    private List<ServiceProvider> favourites;
}
