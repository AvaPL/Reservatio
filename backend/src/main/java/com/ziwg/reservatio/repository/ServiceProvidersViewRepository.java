package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.view.ServiceProvidersView;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface ServiceProvidersViewRepository extends PagingAndSortingRepository<ServiceProvidersView, Long> {
    List<ServiceProvidersView> findByCityOrServiceProviderNameContainsIgnoreCase(String city, String serviceProviderName);
}
