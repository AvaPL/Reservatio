package com.ziwg.reservatio.views.salonviews;

import lombok.Data;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;

@Data
@Entity
@Immutable
@Subselect("select * from salon_view")
public class SalonView {

    @Id
    private Long id;
    private String name;
    private String phone_nr;
    private String email;
    private String street;
    private String property_nr;
    private String city;
    private String post_code;
    private String imageUrl;
    private String open_hour;
    private String close_hour;

}
