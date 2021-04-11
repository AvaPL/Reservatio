package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.view.CustomerReservationView;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface CustomerReservationViewRepository extends PagingAndSortingRepository<CustomerReservationView, Long> {
}
