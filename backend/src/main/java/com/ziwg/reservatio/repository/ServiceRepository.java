package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.entity.Service;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ServiceRepository extends PagingAndSortingRepository<Service, Long> {
}
