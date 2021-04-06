package com.ziwg.reservatio.views;

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
@Subselect("select * from employee_view")
public class EmployeeView {

    @Id
    private Long id;
    private String name;
    @OneToMany(mappedBy = "employeeView")
    private List<EmployeeServiceView> serviceViews;
}
