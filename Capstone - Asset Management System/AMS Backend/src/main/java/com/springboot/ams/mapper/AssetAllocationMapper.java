package com.springboot.ams.mapper;

import com.springboot.ams.dto.response.AllocationRespDto;
import com.springboot.ams.model.AssetAllocation;
import org.springframework.stereotype.Component;

@Component
public class AssetAllocationMapper {

    public AllocationRespDto entityToDto(AssetAllocation allocation) {
        return new AllocationRespDto(
                allocation.getId(),
                allocation.getEmployee().getId(),
                allocation.getEmployee().getUsername(),
                allocation.getAsset().getId(),
                allocation.getAsset().getAssetName(),
                allocation.getAsset().getAssetModel(),
                allocation.getAllocatedAt(),
                allocation.isReturned(),
                allocation.getReturnedAt()
        );
    }
}
