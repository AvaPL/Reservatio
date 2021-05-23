package com.ziwg.reservatio.views.reservations;

import lombok.Data;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.List;

@Data
@Entity
@Immutable
@Subselect("select * from customer_reservation_view")
public class CustomerReservationView {
    @Id
    private Long id;
    @OneToMany(mappedBy = "customerReservationView")
    private List<ReservationView> reservations;
}
