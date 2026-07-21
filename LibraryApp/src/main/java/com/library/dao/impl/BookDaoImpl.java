package com.library.dao.impl;

import com.library.config.HibernateConfig;
import com.library.dao.BookDao;
import com.library.enums.BookStatus;
import com.library.enums.Genre;
import com.library.model.Book;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import java.util.ArrayList;
import java.util.List;

public class BookDaoImpl implements BookDao {

    private final SessionFactory sessionFactory;

    public BookDaoImpl() {
        sessionFactory = HibernateConfig.getSessionFactory();
    }

    @Override
    public Book saveBook(Book book) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()){
            transaction = session.beginTransaction();
            session.persist(book);
            transaction.commit();

            return book;
        }
        catch(Exception e){
            if(transaction != null)
                transaction.rollback();
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public Book getById(int id) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            Book book = session.find(Book.class, id);
            transaction.commit();

            return book;
        }
        catch(Exception e){
            if(transaction != null)
                transaction.rollback();
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public List<Book> getAll() {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            Query<Book> query = session.createQuery("from Book", Book.class);
            List<Book> list = query.list();
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
            Book book = session.find(Book.class, id);
            if(book != null) {
                session.remove(book);
                transaction.commit();
                return;
            }

            transaction.rollback();
            throw new RuntimeException("Invalid ID given ");
        }
    }

    @Override
    public Book update(Book book) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.merge(book);
            transaction.commit();
        }
        return book;
    }

    @Override
    public List<Book> getByAuthor(int authorId) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            Query<Book> query = session.createQuery("from Book b where b.author.id=:id", Book.class);
            query.setParameter("id", authorId);
            List<Book> list = query.list();
            transaction.commit();
            return list;
        }
    }

    @Override
    public List<Book> getByAuthorV2(int authorId) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            Query<Book> query = session.createNativeQuery("select * from books b where b.author_id=:id", Book.class);
            query.setParameter("id", authorId);
            List<Book> list = query.list();
            transaction.commit();
            return list;
        }
    }

    @Override
    public List<Book> getByBorrower(int memberId) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            Query<Book> query = session.createQuery("from Book b where b.borrowedBy.id=:id", Book.class);
            query.setParameter("id", memberId);
            List<Book> list = query.list();
            transaction.commit();
            return list;
        }
    }

    @Override
    public List<Book> filterBooks(Genre genre, BookStatus status) {

        try(Session session = sessionFactory.openSession()){

            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<Book> cq = cb.createQuery(Book.class);
            Root<Book> root = cq.from(Book.class);

            List<Predicate> predicates = new ArrayList<>();

            if(genre != null)
                predicates.add(cb.equal(root.get("genre"), genre));

            if(status != null)
                predicates.add(cb.equal(root.get("status"), status));

            cq.where(predicates.toArray(Predicate[]::new));

            Query<Book> query = session.createQuery(cq);

            return query.list();
        }
    }
}