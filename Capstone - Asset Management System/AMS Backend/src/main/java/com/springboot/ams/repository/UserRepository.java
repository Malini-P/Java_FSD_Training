package com.springboot.ams.repository;

import com.springboot.ams.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // Derived: select * from user_info where username = ?1
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    // JPQL: count all users with a given role
    @Query("""
            select count(u)
            from User u
            where u.role = ?1
            """)
    long countByRole(String role);
}
