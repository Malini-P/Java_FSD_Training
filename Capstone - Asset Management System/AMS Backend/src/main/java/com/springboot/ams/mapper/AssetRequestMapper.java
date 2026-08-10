package com.springboot.ams.mapper;

import com.springboot.ams.dto.request.AssetRequestDto;
import com.springboot.ams.dto.response.AssetRequestRespDto;
import com.springboot.ams.enums.RequestStatus;
import com.springboot.ams.model.AssetRequest;
import org.springframework.stereotype.Component;

@Component
public class AssetRequestMapper {

    public AssetRequest dtoToEntity(AssetRequestDto dto) {
        AssetRequest assetRequest = new AssetRequest();
        assetRequest.setReason(dto.reason());
        assetRequest.setRequestStatus(RequestStatus.PENDING);
        return assetRequest;
    }

    public AssetRequestRespDto entityToDto(AssetRequest assetRequest) {
        return new AssetRequestRespDto(
                assetRequest.getId(),
                assetRequest.getReason(),
                assetRequest.getRequestStatus(),
                assetRequest.getEmployee().getId(),
                assetRequest.getEmployee().getUsername(),
                assetRequest.getAsset().getId(),
                assetRequest.getAsset().getAssetName(),
                assetRequest.getCreatedAt()
        );
    }
}
