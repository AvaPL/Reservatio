package com.ziwg.reservatio.views.bookingviews;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;

@Data
@EqualsAndHashCode(exclude = {"bookingServiceView"})
@Entity
@Immutable
@Subselect("select * from booking_reservation_view")
public class BookingReservationView {

    @Id
    private Long id;
    private Integer grade;
    private String message;
    private String first_name;
    private String last_name;

    @ManyToOne
    @JoinColumn(name = "service_id")
    @JsonBackReference
    private BookingServiceView bookingServiceView;
}
