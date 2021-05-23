package com.ziwg.reservatio.views.bookingviews;

import lombok.Data;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Immutable
@Subselect("select * from booking_view")
public class BookingView {

    @Id
    private Long id;
    private String name;
    private String city;
    private String street;
    private String property_nr;
    private String imageUrl;

    @OneToMany(mappedBy = "bookingView")
    private List<BookingServicesView> services;

    @OneToMany(mappedBy = "bookingView2")
    private List<BookingServiceView> reviews;
}
