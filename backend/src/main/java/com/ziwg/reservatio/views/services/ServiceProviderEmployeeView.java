package com.ziwg.reservatio.views.services;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Data
@EqualsAndHashCode(exclude = {"serviceProviderView"})
@Entity
@Immutable
@Subselect("select * from service_provider_employee_view")
public class ServiceProviderEmployeeView {

    @Id
    private Long id;
    private String name;

    @ManyToOne
    @JoinColumn(name = "service_provider_id")
    private ServiceProviderServicesView serviceProviderView;
}
