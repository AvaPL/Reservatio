package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.entity.Reservation;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends PagingAndSortingRepository<Reservation, Long> {
    @Query("select r.id from Reservation r where r.service.id in :serviceId")
    List<Reservation> findByServiceId(@Param("serviceId") Long serviceId);
}
