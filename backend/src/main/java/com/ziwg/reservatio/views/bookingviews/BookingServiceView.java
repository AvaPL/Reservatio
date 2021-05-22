package com.ziwg.reservatio.views.bookingviews;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;
import java.util.List;

@Data
@EqualsAndHashCode(exclude = {"bookingView2"})
@Entity
@Immutable
@Subselect("select * from booking_service_view")
public class BookingServiceView {

    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "service_provider_id")
    private BookingView bookingView2;

    @OneToMany(mappedBy = "bookingServiceView")
    @Column(nullable = true)
    @JsonManagedReference
    private List<BookingReservationView> reservations;
}
