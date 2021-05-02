package com.ziwg.reservatio.views.services;

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
@Subselect("select * from service_provider_services_view")
public class ServiceProviderServicesView {

    @Id
    private Long id;

    @OneToMany(mappedBy = "serviceProviderView")
    private List<ServiceProviderEmployeeView> employees;

    @OneToMany(mappedBy = "serviceProviderView")
    private List<ServiceView> services;
}
