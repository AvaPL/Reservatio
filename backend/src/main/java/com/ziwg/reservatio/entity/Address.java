package com.ziwg.reservatio.entity;


import com.sun.istack.NotNull;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Address {
    @Id
    @GeneratedValue
    private Long id;
    @NotNull
    @Column(length = 45)
    private String street;
    @NotNull
    @Column(length = 6)
    private String property_nr;
    @NotNull
    @Column(length = 30)
    private String city;
    @NotNull
    @Column(length = 6)
    private String post_code;
}
