package com.library.mapper;

import com.library.dto.EventRegistrationDto;
import com.library.model.EventRegistration;

public class EventRegistrationMapper {
    public EventRegistrationDto mapEntityToDto(EventRegistration registration) {
        // I have an Entity given to me, and i need to convert it to dto record

        // Create an Object of Dto and pass the fields to its constructor
        EventRegistrationDto dto = new EventRegistrationDto(
                registration.getId(),
                registration.getMember().getName(),
                registration.getMember().getEmail(),
                registration.getEvent().getTitle(),
                registration.getEvent().getEventDate(),
                registration.getRegisteredAt(),
                registration.getAttendanceStatus()
        );
        return dto;
    }
}