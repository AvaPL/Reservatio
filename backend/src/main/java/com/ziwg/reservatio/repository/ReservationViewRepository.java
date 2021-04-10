package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.view.ReservationView;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ReservationViewRepository extends PagingAndSortingRepository<ReservationView, Long> {
}
