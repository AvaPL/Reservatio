package com.ziwg.reservatio.pojos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReservationToAddPojo {
    private Long serviceId;
    private Long employeeId;
    private LocalDateTime dateTime;
}
