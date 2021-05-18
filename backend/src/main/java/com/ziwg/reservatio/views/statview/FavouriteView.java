package com.ziwg.reservatio.views.statview;

import lombok.Data;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Immutable
@Subselect("select * from favourite_view")
public class FavouriteView {

    @Id
    private Long id;
    private Long number;

}
