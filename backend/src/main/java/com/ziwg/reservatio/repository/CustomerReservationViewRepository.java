package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.views.reservations.CustomerReservationView;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;

@CrossOrigin(methods = RequestMethod.GET)
public interface CustomerReservationViewRepository extends PagingAndSortingRepository<CustomerReservationView, Long> {
}
