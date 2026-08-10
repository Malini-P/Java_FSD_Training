package com.springboot.ams.repository;

import com.springboot.ams.enums.RequestStatus;
import com.springboot.ams.model.AssetRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRequestRepository extends JpaRepository<AssetRequest, Integer> {

    // Derived: select * from asset_requests where employee.username = ?1
    List<AssetRequest> findByEmployeeUsername(String username);

    // JPQL: get all requests for a given employee username
    @Query("""
            select ar
            from AssetRequest ar
            where ar.employee.username = ?1
            """)
    List<AssetRequest> getRequestsByEmployeeUsername(String username);

    // JPQL: get all requests for a given asset id
    @Query("""
            select ar
            from AssetRequest ar
            where ar.asset.id = ?1
            """)
    List<AssetRequest> getRequestsByAssetId(int assetId);

    // JPQL: count requests by status
    @Query("""
            select count(ar)
            from AssetRequest ar
            where ar.requestStatus = ?1
            """)
    long countByRequestStatus(RequestStatus requestStatus);

    // JPQL: count requests by employee username and status
    @Query("""
            select count(ar)
            from AssetRequest ar
            where ar.employee.username = ?1
            and ar.requestStatus = ?2
            """)
    long countByEmployeeUsernameAndRequestStatus(String username, RequestStatus requestStatus);
}
