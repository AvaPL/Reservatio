package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.views.reservations.ReservationView;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ReservationViewRepository extends PagingAndSortingRepository<ReservationView, Long> {
}
