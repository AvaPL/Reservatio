package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.entity.Service;
import lombok.val;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface ServiceRepository extends PagingAndSortingRepository<Service, Long> {

     Optional<Service> findByNameAndServiceProviderId(String name, Long serviceProviderId);
}
