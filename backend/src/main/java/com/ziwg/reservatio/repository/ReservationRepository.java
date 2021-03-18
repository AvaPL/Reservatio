package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.entity.Reservation;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ReservationRepository extends PagingAndSortingRepository<Reservation, Long> {
}
