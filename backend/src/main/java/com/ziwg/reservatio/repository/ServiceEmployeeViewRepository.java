package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.views.services.ServiceEmployeeView;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported = false)
public interface ServiceEmployeeViewRepository extends PagingAndSortingRepository<ServiceEmployeeView, Long> {
    @Query("select sev.id from ServiceEmployeeView sev where sev.serviceView.id in :serviceId")
    List<Long> findByServiceId(@Param("serviceId") Long serviceId);
}
