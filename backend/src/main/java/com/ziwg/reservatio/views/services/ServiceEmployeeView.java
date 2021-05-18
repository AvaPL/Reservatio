package com.ziwg.reservatio.views.services;

import lombok.Data;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Data
@Entity
@Immutable
@Subselect("select * from service_employee_view")
public class ServiceEmployeeView {

    @Id
    private Long id;
    private String name;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private ServiceView serviceView;
}
