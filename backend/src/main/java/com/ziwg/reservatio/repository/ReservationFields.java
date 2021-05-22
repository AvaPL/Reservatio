package com.ziwg.reservatio.repository;

import java.time.LocalDateTime;

public interface ReservationFields {
    LocalDateTime getDateTime();
    Long getId();
    ServiceDurationField getService();

    interface ServiceDurationField {
        Integer getDurationMinutes();
        String getName();
        Float getPriceUsd();
    }
}
