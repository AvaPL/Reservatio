package com.ziwg.reservatio.auth.role;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Roles {
    CUSTOMER("customer"),
    SERVICE_PROVIDER("service_provider");

    private final String roleName;
}
