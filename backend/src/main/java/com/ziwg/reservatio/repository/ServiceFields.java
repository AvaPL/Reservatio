package com.ziwg.reservatio.repository;

public interface ServiceFields {
    Long getId();

    String getDescription();

    Integer getDurationMinutes();

    String getName();

    Float getPriceUsd();
}
