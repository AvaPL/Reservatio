package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.entity.Customer;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface EmployeeRepository extends PagingAndSortingRepository<Customer, Long> {
}
