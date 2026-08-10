package com.springboot.ams.repository;

import com.springboot.ams.model.AssetCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AssetCategoryRepository extends JpaRepository<AssetCategory, Integer> {

    // Derived: select * from asset_categories where category_name = ?1
    Optional<AssetCategory> findByCategoryName(String categoryName);

    // JPQL: find category by name (case-insensitive)
    @Query("""
            select c
            from AssetCategory c
            where lower(c.categoryName) = lower(?1)
            """)
    Optional<AssetCategory> findByCategoryNameIgnoreCase(String categoryName);
}
