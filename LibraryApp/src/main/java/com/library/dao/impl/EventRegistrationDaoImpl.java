package com.library.dao.impl;


import com.library.dto.EventRegistrationDto;
import com.library.mapper.EventRegistrationMapper;
import java.util.stream.Collectors;
import com.library.config.HibernateConfig;
import com.library.dao.EventRegistrationDao;
import com.library.enums.AttendanceStatus;
import com.library.model.EventRegistration;
import com.library.model.Member;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.query.Query;


import java.util.List;

public class EventRegistrationDaoImpl implements EventRegistrationDao {

    private final SessionFactory sessionFactory;

    public EventRegistrationDaoImpl() {
        sessionFactory = HibernateConfig.getSessionFactory();
    }

    private final EventRegistrationMapper mapper = new EventRegistrationMapper();

    @Override
    public List<EventRegistrationDto> findRegistrationsForEventAsDto(int eventId) {
        List<EventRegistration> registrations = findRegistrationsForEvent(eventId);
        return registrations.stream()
                .map(mapper::mapEntityToDto)
                .toList();
    }

    @Override
    public EventRegistration saveRegistration(EventRegistration registration) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()){
            transaction = session.beginTransaction();
            session.persist(registration);
            transaction.commit();

            return registration;
        }
        catch(Exception e){
            if(transaction != null)
                transaction.rollback();
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public EventRegistration getById(int id) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            EventRegistration registration = session.find(EventRegistration.class, id);
            transaction.commit();

            return registration;
        }
        catch(Exception e){
            if(transaction != null)
                transaction.rollback();
            throw new RuntimeException(e.getMessage());
        }
    }

    // Task 6: all registrations for a given event
    @Override
    public List<EventRegistration> findRegistrationsForEvent(int eventId) {
        String jpql = """
                select er
                from EventRegistration er
                where er.event.id = ?1
                """;
        try (Session session = sessionFactory.openSession()) {
            Query<EventRegistration> query = session.createQuery(jpql, EventRegistration.class);
            query.setParameter(1, eventId);
            return query.list();
        }
    }

    // Task 7: members who registered but did not attend (NO_SHOW)
    @Override
    public List<Member> findNoShowsForEvent(int eventId) {
        String jpql = """
                select er.member
                from EventRegistration er
                where er.event.id = ?1
                and er.attendanceStatus = ?2
                """;
        try (Session session = sessionFactory.openSession()) {
            Query<Member> query = session.createQuery(jpql, Member.class);
            query.setParameter(1, eventId);
            query.setParameter(2, AttendanceStatus.NO_SHOW);
            return query.list();
        }
    }

    @Override
    public EventRegistration update(EventRegistration registration) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.merge(registration);
            transaction.commit();
        }
        return registration;
    }


}