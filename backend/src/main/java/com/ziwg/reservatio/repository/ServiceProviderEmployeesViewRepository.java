package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.views.employeesviews.ServiceProviderEmployeesView;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;

@CrossOrigin(methods = RequestMethod.GET)
public interface ServiceProviderEmployeesViewRepository extends PagingAndSortingRepository<ServiceProviderEmployeesView, Long> {
}
