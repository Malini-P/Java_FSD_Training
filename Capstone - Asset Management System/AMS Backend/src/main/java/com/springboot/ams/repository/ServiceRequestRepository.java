package com.springboot.ams.repository;

import com.springboot.ams.enums.ServiceStatus;
import com.springboot.ams.model.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Integer> {

    // Derived: select * from service_requests where employee.username = ?1
    List<ServiceRequest> findByEmployeeUsername(String username);

    // JPQL: get all service requests for a given employee username
    @Query("""
            select sr
            from ServiceRequest sr
            where sr.employee.username = ?1
            """)
    List<ServiceRequest> getServiceRequestsByEmployeeUsername(String username);

    // JPQL: get all service requests for a given asset id
    @Query("""
            select sr
            from ServiceRequest sr
            where sr.asset.id = ?1
            """)
    List<ServiceRequest> getServiceRequestsByAssetId(int assetId);

    // JPQL: count service requests by status
    @Query("""
            select count(sr)
            from ServiceRequest sr
            where sr.serviceStatus = ?1
            """)
    long countByServiceStatus(ServiceStatus serviceStatus);

    // JPQL: count service requests by employee username and status
    @Query("""
            select count(sr)
            from ServiceRequest sr
            where sr.employee.username = ?1
            and sr.serviceStatus = ?2
            """)
    long countByEmployeeUsernameAndServiceStatus(String username, ServiceStatus serviceStatus);
}
