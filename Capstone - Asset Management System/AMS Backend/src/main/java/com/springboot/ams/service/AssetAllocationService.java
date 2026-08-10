package com.springboot.ams.service;

import com.springboot.ams.dto.response.AllocationRespDto;
import com.springboot.ams.enums.AssetStatus;
import com.springboot.ams.exception.ResourceNotFoundException;
import com.springboot.ams.mapper.AssetAllocationMapper;
import com.springboot.ams.model.Asset;
import com.springboot.ams.model.AssetAllocation;
import com.springboot.ams.model.User;
import com.springboot.ams.repository.AssetAllocationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@AllArgsConstructor
public class AssetAllocationService {

    private final AssetAllocationRepository assetAllocationRepository;
    private final AssetAllocationMapper assetAllocationMapper;
    private final AssetService assetService;

    public AssetAllocation createAllocation(User employee, Asset asset) {
        AssetAllocation allocation = new AssetAllocation();
        allocation.setEmployee(employee);
        allocation.setAsset(asset);
        allocation.setReturned(false);
        // Change asset status to ALLOCATED
        asset.setAssetStatus(AssetStatus.ALLOCATED);
        return assetAllocationRepository.save(allocation);
    }

    public List<AllocationRespDto> getAll() {
        return assetAllocationRepository.findAll()
                .stream()
                .map(assetAllocationMapper::entityToDto)
                .toList();
    }

    public List<AllocationRespDto> getMyAllocations(String username) {
        return assetAllocationRepository.findByEmployeeUsername(username)
                .stream()
                .map(assetAllocationMapper::entityToDto)
                .toList();
    }

    public AllocationRespDto returnAsset(int allocationId) {
        AssetAllocation allocation = assetAllocationRepository.findById(allocationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid allocation id"));

        // Mark as returned
        allocation.setReturned(true);
        allocation.setReturnedAt(Instant.now());

        // Change asset status back to AVAILABLE
        Asset asset = allocation.getAsset();
        asset.setAssetStatus(AssetStatus.AVAILABLE);

        AssetAllocation saved = assetAllocationRepository.save(allocation);
        return assetAllocationMapper.entityToDto(saved);
    }

    public long countMyActiveAllocations(String username) {
        return assetAllocationRepository.countByEmployeeUsernameAndReturnedFalse(username);
    }
}
