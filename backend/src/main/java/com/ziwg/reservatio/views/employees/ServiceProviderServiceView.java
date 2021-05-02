package com.ziwg.reservatio.views.employees;

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
@Subselect("select * from service_provider_service_view")
public class ServiceProviderServiceView {

    @Id
    private Long id;
    private String name;

    @ManyToOne
    @JoinColumn(name = "service_provider_id")
    private ServiceProviderEmployeesView serviceProviderView;
}
