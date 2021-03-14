package com.ziwg.reservatio.entity;

import com.sun.istack.NotNull;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class Service {
    @Id
    @GeneratedValue
    private Long id;
    @NotNull
    @Column(length = 100)
    private String name;

    @ManyToOne
    private ServiceProvider serviceProvider;

    @ManyToMany(mappedBy = "services")
    private List<Employee> employees;
}
