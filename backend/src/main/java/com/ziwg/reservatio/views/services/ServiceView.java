package com.ziwg.reservatio.views.services;

import lombok.Data;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Immutable
@Subselect("select * from service_view")
public class ServiceView {

    @Id
    private Long id;
    private String name;
    private String description;
    private Float priceUsd;
    private Integer durationMinutes;

    @ManyToOne
    @JoinColumn(name = "service_provider_id")
    private ServiceProviderServicesView serviceProviderView;

    @OneToMany(mappedBy = "serviceView")
    private List<ServiceEmployeeView> employees;
}
