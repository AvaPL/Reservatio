package com.ziwg.reservatio.views.reservation;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Data
@EqualsAndHashCode(exclude = {"customerReservationView"})
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
    private String reviewId;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private CustomerReservationView customerReservationView;

}
