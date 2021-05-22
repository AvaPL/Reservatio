package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.entity.ServiceProvider;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;


public interface ServiceProviderRepository extends PagingAndSortingRepository<ServiceProvider, Long> {
    Optional<ServiceProviderFields> getById(@Param("id") Long id);
}

