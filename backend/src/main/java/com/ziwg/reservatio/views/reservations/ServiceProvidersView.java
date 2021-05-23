package com.ziwg.reservatio.views.reservations;

import lombok.Data;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.Entity;
import javax.persistence.Id;

@Data
@Entity
@Immutable
@Subselect("select * from service_providers_view")
public class ServiceProvidersView {
    @Id
    private Long id;
    private String serviceProviderName;
    private Float averageGrade;
    private String city;
    private String imageUrl;
}
