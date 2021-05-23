package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.entity.Employee;
import com.ziwg.reservatio.entity.Reservation;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmployeeRepository extends PagingAndSortingRepository<Employee, Long> {
}
