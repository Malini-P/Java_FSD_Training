package com.library.dao;

import com.library.dto.EventRegistrationDto;
import com.library.enums.AttendanceStatus;
import com.library.model.EventRegistration;
import com.library.model.Member;

import java.util.List;

public interface EventRegistrationDao {
    EventRegistration saveRegistration(EventRegistration registration);

    EventRegistration getById(int id);

    List<EventRegistration> findRegistrationsForEvent(int eventId);

    List<Member> findNoShowsForEvent(int eventId);

    List<EventRegistrationDto> findRegistrationsForEventAsDto(int eventId);

    EventRegistration update(EventRegistration registration);
}