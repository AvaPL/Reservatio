package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.entity.Address;

import java.time.LocalTime;

public interface ServiceProviderFields {
    Long getId();

    String getName();

    String getImageUrl();

    String getPhoneNumber();

    String getEmail();

    LocalTime getOpenHours();

    LocalTime getCloseHours();
}
