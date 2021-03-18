package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.entity.Employee;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface EmployeeRepository extends PagingAndSortingRepository<Employee, Long> {
}
