package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.entity.Employee;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface EmployeeRepository extends PagingAndSortingRepository<Employee, Long> {

    Optional<Employee> findByFirstNameAndLastNameAndServiceProviderId(String firstName, String lastName, Long serviceProvider_id);
}
