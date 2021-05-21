package com.ziwg.reservatio.views.employees;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Data
@EqualsAndHashCode(exclude = {"employeeView"})
@Entity
@Immutable
@Subselect("select * from employee_service_view")
public class EmployeeServiceView {

    @Id
    private Long id;
    private String name;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private EmployeeView employeeView;
}
