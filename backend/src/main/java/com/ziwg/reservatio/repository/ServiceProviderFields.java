package com.ziwg.reservatio.repository;

import com.ziwg.reservatio.entity.Address;

public interface ServiceProviderFields {
    Long getId();

    String getName();

    Address getAddress();

    String getImageUrl();

    String getPhoneNumber();

    String getEmail();
}
