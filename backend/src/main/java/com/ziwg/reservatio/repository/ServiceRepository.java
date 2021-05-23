package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.entity.Service;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ServiceRepository extends PagingAndSortingRepository<Service, Long> {
     //@Query("select s.id, s.description, s.durationMinutes, s.name, s.priceUsd from Service s where s.id in :serviceId")
     Optional<ServiceFields> getById(@Param("serviceId") Long serviceId);

     Optional<Service> findByNameAndServiceProviderId(String name, Long serviceProviderId);
}

