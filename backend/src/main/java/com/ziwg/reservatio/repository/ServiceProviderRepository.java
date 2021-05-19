package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.entity.Address;
import com.ziwg.reservatio.entity.Service;
import com.ziwg.reservatio.entity.ServiceProvider;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;


public interface ServiceProviderRepository extends PagingAndSortingRepository<ServiceProvider, Long> {
    //@Query("select sp.id, sp.name, sp.address, sp.imageUrl, sp.phoneNumber, sp.email from ServiceProvider sp where sp.id in :serviceProviderId")
    Optional<ServiceProviderFields> getById(@Param("id") Long id);
}

