package com.ziwg.reservatio.views.bookingviews;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;

@Data
@EqualsAndHashCode(exclude = {"bookingView"})
@Entity
@Immutable
@Subselect("select * from booking_services_view")
public class BookingServicesView {

    @Id
    private Long id;
    private String name;
    private Float price;

    @ManyToOne
    @JoinColumn(name = "service_provider_id")
    private BookingView bookingView;

}
