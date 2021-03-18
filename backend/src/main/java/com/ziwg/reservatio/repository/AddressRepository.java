package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.entity.Address;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface AddressRepository extends PagingAndSortingRepository<Address, Long> {
}
