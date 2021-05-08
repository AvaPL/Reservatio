package com.ziwg.reservatio.views.bookingviews;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;

@Data
@Entity
@Immutable
@Subselect("select * from booking_reservation_view")
public class BookingReservationView {

    @Id
    private Long id;
    private Integer grade;
    private String message;

    @ManyToOne
    @JoinColumn(name = "service_id")
    @JsonBackReference
    private BookingServiceView bookingServiceView;
}
