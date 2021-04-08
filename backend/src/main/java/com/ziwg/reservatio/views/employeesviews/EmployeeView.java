package com.ziwg.reservatio.views.employeesviews;

import lombok.Data;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Immutable
@Subselect("select * from employee_view")
public class EmployeeView {

    @Id
    private Long id;
    private String firstName;
    private String lastName;

    @ManyToOne
    @JoinColumn(name = "service_provider_id")
    private ServiceProviderEmployeesView serviceProviderView;

    @OneToMany(mappedBy = "employeeView")
    private List<EmployeeServiceView> services;
}
