package com.springboot.ams.repository;

import com.springboot.ams.enums.AssetStatus;
import com.springboot.ams.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Integer> {

    // Derived: select * from assets where asset_status = ?1
    List<Asset> findByAssetStatus(AssetStatus assetStatus);

    // JPQL: find all assets belonging to a given category id
    @Query("""
            select a
            from Asset a
            where a.category.id = ?1
            """)
    List<Asset> getAssetsByCategoryId(int categoryId);

    // JPQL: find all assets belonging to a given category name
    @Query("""
            select a
            from Asset a
            where a.category.categoryName = ?1
            """)
    List<Asset> getAssetsByCategoryName(String categoryName);

    // JPQL: count assets by status
    @Query("""
            select count(a)
            from Asset a
            where a.assetStatus = ?1
            """)
    long countByAssetStatus(AssetStatus assetStatus);

    // JPQL: find available assets with their category info (join)
    @Query("""
            select a
            from Asset a
            join a.category c
            where a.assetStatus = com.springboot.ams.enums.AssetStatus.AVAILABLE
            """)
    List<Asset> getAvailableAssetsWithCategory();
}
