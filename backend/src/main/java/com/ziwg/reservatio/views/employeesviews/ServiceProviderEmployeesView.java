package com.ziwg.reservatio.views.employeesviews;

import lombok.Data;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import java.util.List;

@Data
@Entity
@Immutable
@Subselect("select * from service_provider_employees_view")
public class ServiceProviderEmployeesView {

    @Id
    private Long id;

    @OneToMany(mappedBy = "serviceProviderView")
    private List<ServiceProviderServiceView> services;

    @OneToMany(mappedBy = "serviceProviderView")
    private List<EmployeeView> employees;
}
