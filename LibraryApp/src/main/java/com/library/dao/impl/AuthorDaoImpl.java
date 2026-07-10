package com.library.dao.impl;

import com.library.config.HibernateConfig;
import com.library.dao.AuthorDao;
import com.library.model.Author;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import java.util.List;

public class AuthorDaoImpl implements AuthorDao {

    private final SessionFactory sessionFactory;

    public AuthorDaoImpl() {
        sessionFactory = HibernateConfig.getSessionFactory();
    }

    @Override
    public Author saveAuthor(Author author) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()){
            transaction = session.beginTransaction();
            session.persist(author);
            transaction.commit();

            return author;
        }
        catch(Exception e){
            if(transaction != null)
                transaction.rollback();
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public Author getById(int id) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            Author author = session.find(Author.class, id);
            transaction.commit();

            return author;
        }
        catch(Exception e){
            if(transaction != null)
                transaction.rollback();
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public List<Author> getAll() {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            Query<Author> query = session.createQuery("from Author", Author.class);
            List<Author> list = query.list();
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
            Author author = session.find(Author.class, id);
            if(author != null) {
                session.remove(author);
                transaction.commit();
                return;
            }

            transaction.rollback();
            throw new RuntimeException("Invalid ID given ");
        }
    }

    @Override
    public Author update(Author author) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.merge(author);
            transaction.commit();
        }
        return author;
    }
}