package com.ziwg.reservatio.view;

import com.ziwg.reservatio.entity.Service;
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
@Subselect("select * from service_providers_view")
public class ServiceProvidersView {
    @Id
    private Long id;
    private String serviceProviderName;
    private String averageGrade;
    private String city;
}
