package com.library.model;

import com.library.enums.AttendanceStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "event_registrations")
public class EventRegistration { // er

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Member  1:M   EventRegistration   M:1   LibraryEvent
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member; // creates FK member_id  -- er.member

    @ManyToOne
    @JoinColumn(name = "event_id")
    private LibraryEvent event; // er.event

    @CreationTimestamp
    private Instant registeredAt;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus attendanceStatus;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Member getMember() {
        return member;
    }

    public void setMember(Member member) {
        this.member = member;
    }

    public LibraryEvent getEvent() {
        return event;
    }

    public void setEvent(LibraryEvent event) {
        this.event = event;
    }

    public Instant getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(Instant registeredAt) {
        this.registeredAt = registeredAt;
    }

    public AttendanceStatus getAttendanceStatus() {
        return attendanceStatus;
    }

    public void setAttendanceStatus(AttendanceStatus attendanceStatus) {
        this.attendanceStatus = attendanceStatus;
    }

    @Override
    public String toString() {
        return "EventRegistration{" +
                "id=" + id +
                ", member=" + member +
                ", event=" + event +
                ", registeredAt=" + registeredAt +
                ", attendanceStatus=" + attendanceStatus +
                '}';
    }
}