package com.springboot.ams.repository;

import com.springboot.ams.model.AssetAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetAllocationRepository extends JpaRepository<AssetAllocation, Integer> {

    // Derived: select * from asset_allocations where employee.username = ?1
    List<AssetAllocation> findByEmployeeUsername(String username);

    List<AssetAllocation> findByReturnedFalse();

    // JPQL: get all active (not returned) allocations for a given employee
    @Query("""
            select aa
            from AssetAllocation aa
            where aa.employee.username = ?1
            and aa.returned = false
            """)
    List<AssetAllocation> getActiveAllocationsByEmployee(String username);

    // JPQL: check if a specific asset is currently allocated (not returned)
    @Query("""
            select aa
            from AssetAllocation aa
            where aa.asset.id = ?1
            and aa.returned = false
            """)
    List<AssetAllocation> getAllocationsByAssetId(int assetId);

    // JPQL: count active allocations (not returned) for an employee
    @Query("""
            select count(aa)
            from AssetAllocation aa
            where aa.employee.username = ?1
            and aa.returned = false
            """)
    long countByEmployeeUsernameAndReturnedFalse(String username);
}
