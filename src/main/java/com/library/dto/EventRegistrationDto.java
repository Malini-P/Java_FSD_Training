package com.library.dto;

import com.library.enums.AttendanceStatus;

import java.time.Instant;

public record EventRegistrationDto(
        int registrationId,
        String memberName,
        String memberEmail,
        String eventTitle,
        Instant eventDate,
        Instant registeredAt,
        AttendanceStatus attendanceStatus
) {
}