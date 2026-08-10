package com.springboot.ams.mapper;

import com.springboot.ams.dto.response.AuditRespDto;
import com.springboot.ams.model.AssetAudit;
import org.springframework.stereotype.Component;

@Component
public class AuditMapper {

    public AuditRespDto entityToDto(AssetAudit audit) {
        return new AuditRespDto(
                audit.getId(),
                audit.getAsset().getId(),
                audit.getAsset().getAssetName(),
                audit.getAsset().getAssetModel(),
                audit.getEmployee().getId(),
                audit.getEmployee().getUsername(),
                audit.getStatus(),
                audit.getSentAt(),
                audit.getVerifiedAt()
        );
    }
}
