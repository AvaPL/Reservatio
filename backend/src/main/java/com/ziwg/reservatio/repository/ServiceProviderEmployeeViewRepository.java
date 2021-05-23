package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.views.services.ServiceProviderEmployeeView;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ServiceProviderEmployeeViewRepository extends PagingAndSortingRepository<ServiceProviderEmployeeView, Long> {
    @Query("select spev.id, spev.name from ServiceProviderEmployeeView spev where spev.serviceProviderView.id in :serviceProviderId")
    List<Long> findByServiceProviderId(@Param("serviceProviderId") Long serviceProviderId);
}
