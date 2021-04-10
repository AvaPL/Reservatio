package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.views.employeesviews.EmployeeView;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface EmployeeViewRepository extends PagingAndSortingRepository<EmployeeView, Long> {
}
