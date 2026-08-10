package com.springboot.ams.repository;

import com.springboot.ams.model.AssetAudit;
import com.springboot.ams.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssetAuditRepository extends JpaRepository<AssetAudit, Integer> {

    List<AssetAudit> findByEmployee(User employee);

}
