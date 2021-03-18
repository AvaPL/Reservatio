package com.ziwg.reservatio.entity;

import com.sun.istack.NotNull;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Review {

    @Id
    @GeneratedValue
    private Long id;
    @NotNull
    private Integer grade;
    @Column(length = 2000)
    private String message;
    @OneToOne
    private Reservation reservation;

}
