package com.library.dao.impl;

import com.library.config.HibernateConfig;
import com.library.dao.LibraryEventDao;
import com.library.model.LibraryEvent;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import java.util.List;

public class LibraryEventDaoImpl implements LibraryEventDao {

    private final SessionFactory sessionFactory;

    public LibraryEventDaoImpl() {
        sessionFactory = HibernateConfig.getSessionFactory();
    }

    @Override
    public LibraryEvent saveEvent(LibraryEvent event) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()){
            transaction = session.beginTransaction();
            session.persist(event);
            transaction.commit();

            return event;
        }
        catch(Exception e){
            if(transaction != null)
                transaction.rollback();
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public LibraryEvent getById(int id) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            LibraryEvent event = session.find(LibraryEvent.class, id);
            transaction.commit();

            return event;
        }
        catch(Exception e){
            if(transaction != null)
                transaction.rollback();
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public List<LibraryEvent> getAll() {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            Query<LibraryEvent> query = session.createQuery("from LibraryEvent", LibraryEvent.class);
            List<LibraryEvent> list = query.list();
            transaction.commit();
            return list;
        }
        catch(Exception e){
            if(transaction != null)
                transaction.rollback();
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void deleteById(int id) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            LibraryEvent event = session.find(LibraryEvent.class, id);
            if(event != null) {
                session.remove(event);
                transaction.commit();
                return;
            }

            transaction.rollback();
            throw new RuntimeException("Invalid ID given ");
        }
    }

    @Override
    public LibraryEvent update(LibraryEvent event) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.merge(event);
            transaction.commit();
        }
        return event;
    }
}