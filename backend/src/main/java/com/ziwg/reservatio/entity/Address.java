package com.ziwg.reservatio.entity;


import com.sun.istack.NotNull;
import lombok.*;

import javax.persistence.*;

@Entity
@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    @Column(length = 45)
    private String street;
    @NotNull
    @Column(length = 6)
    private String propertyNumber;
    @NotNull
    @Column(length = 30)
    private String city;
    @NotNull
    @Column(length = 6)
    private String postCode;
}
