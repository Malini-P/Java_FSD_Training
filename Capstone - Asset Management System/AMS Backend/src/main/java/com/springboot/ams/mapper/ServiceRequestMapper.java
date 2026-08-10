package com.springboot.ams.mapper;

import com.springboot.ams.dto.request.ServiceRequestDto;
import com.springboot.ams.dto.response.ServiceRequestRespDto;
import com.springboot.ams.enums.ServiceStatus;
import com.springboot.ams.model.ServiceRequest;
import org.springframework.stereotype.Component;

@Component
public class ServiceRequestMapper {

    public ServiceRequest dtoToEntity(ServiceRequestDto dto) {
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setIssueDescription(dto.issueDescription());
        serviceRequest.setIssueType(dto.issueType());
        serviceRequest.setServiceStatus(ServiceStatus.OPEN);
        return serviceRequest;
    }

    public ServiceRequestRespDto entityToDto(ServiceRequest serviceRequest) {
        return new ServiceRequestRespDto(
                serviceRequest.getId(),
                serviceRequest.getIssueDescription(),
                serviceRequest.getIssueType(),
                serviceRequest.getServiceStatus(),
                serviceRequest.getEmployee().getId(),
                serviceRequest.getEmployee().getUsername(),
                serviceRequest.getAsset().getId(),
                serviceRequest.getAsset().getAssetName(),
                serviceRequest.getCreatedAt(),
                serviceRequest.getUpdatedAt()
        );
    }
}
