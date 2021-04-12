package com.ziwg.reservatio.view;


import lombok.Data;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

// TODO: Invalid package
@Data
@Entity
@Immutable
@Subselect("select * from reservation_view")
public class ReservationView {

    @Id
    private Long id;
    private String dateTime;
    private String serviceName;
    private String duration;
    private String providerName;

}
