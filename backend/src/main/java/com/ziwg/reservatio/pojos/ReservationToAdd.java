package com.ziwg.reservatio.pojos;

import lombok.Data;

@Data
public class ReservationToAdd {
    private Long serviceId;
    private Long customerId;
    private Long employeeId;
}
