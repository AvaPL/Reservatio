package com.ziwg.reservatio.entity;


import com.sun.istack.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE, force = true)
@RequiredArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Column(length = 50)
    private final String street;
    @NotNull
    @Column(length = 10)
    private final String propertyNumber;
    @NotNull
    @Column(length = 50)
    private final String city;
    @NotNull
    @Column(length = 10)
    private final String postCode;
}
