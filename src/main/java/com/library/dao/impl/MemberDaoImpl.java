package com.library.dao.impl;

import com.library.config.HibernateConfig;
import com.library.dao.MemberDao;
import com.library.model.Member;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import java.util.List;

public class MemberDaoImpl implements MemberDao {

    private final SessionFactory sessionFactory;

    public MemberDaoImpl() {
        sessionFactory = HibernateConfig.getSessionFactory();
    }

    @Override
    public Member saveMember(Member member) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()){
            transaction = session.beginTransaction();
            session.persist(member);
            transaction.commit();

            return member;
        }
        catch(Exception e){
            if(transaction != null)
                transaction.rollback();
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public Member getById(int id) {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            Member member = session.find(Member.class, id);
            transaction.commit();

            return member;
        }
        catch(Exception e){
            if(transaction != null)
                transaction.rollback();
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public List<Member> getAll() {
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            Query<Member> query = session.createQuery("from Member", Member.class);
            List<Member> list = query.list();
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
            Member member = session.find(Member.class, id);
            if(member != null) {
                session.remove(member);
                transaction.commit();
                return;
            }

            transaction.rollback();
            throw new RuntimeException("Invalid ID given ");
        }
    }

    @Override
    public Member update(Member member) {
        Transaction transaction = null;
        try (Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.merge(member);
            transaction.commit();
        }
        return member;
    }
}