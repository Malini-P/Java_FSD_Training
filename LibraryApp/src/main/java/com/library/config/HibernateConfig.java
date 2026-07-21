package com.library.config;

import com.library.model.*;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.AvailableSettings;
import org.hibernate.cfg.Configuration;

public class HibernateConfig {

    private static SessionFactory sessionFactory;

    public static SessionFactory getSessionFactory(){
        if(sessionFactory == null) {
            try {
                Configuration config = new Configuration();
                config.setProperty(AvailableSettings.JAKARTA_JDBC_URL, "jdbc:mysql://localhost:3306/library_db");
                config.setProperty(AvailableSettings.JAKARTA_JDBC_USER, "root");
                config.setProperty(AvailableSettings.JAKARTA_JDBC_PASSWORD, "Malini@2004");
                config.setProperty(AvailableSettings.JAKARTA_JDBC_DRIVER, "com.mysql.cj.jdbc.Driver");

                config.setProperty(AvailableSettings.DIALECT, "org.hibernate.dialect.MySQLDialect");
                config.setProperty(AvailableSettings.HBM2DDL_AUTO, "update");

                // Register the model classes
                config.addAnnotatedClass(Author.class);
                config.addAnnotatedClass(Book.class);
                config.addAnnotatedClass(Member.class);
                config.addAnnotatedClass(LibraryEvent.class);
                config.addAnnotatedClass(EventRegistration.class);

                StandardServiceRegistry registry = new StandardServiceRegistryBuilder()
                        .applySettings(config.getProperties())
                        .build();

                sessionFactory = config.buildSessionFactory(registry);

            } catch (Exception e) {
                throw new RuntimeException(e.getMessage());
            }
        }
        return sessionFactory;
    }

    public static void closeFactory(){
        if(sessionFactory != null)
            sessionFactory.close();
    }
}