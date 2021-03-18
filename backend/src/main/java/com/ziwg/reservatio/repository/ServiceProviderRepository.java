package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.entity.ServiceProvider;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ServiceProviderRepository extends PagingAndSortingRepository<ServiceProvider, Long> {
}
