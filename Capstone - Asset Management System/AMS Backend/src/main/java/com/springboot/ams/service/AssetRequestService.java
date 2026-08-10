package com.springboot.ams.service;

import com.springboot.ams.dto.request.AssetRequestDto;
import com.springboot.ams.dto.response.AssetRequestRespDto;
import com.springboot.ams.enums.AssetStatus;
import com.springboot.ams.enums.RequestStatus;
import com.springboot.ams.exception.ResourceNotFoundException;
import com.springboot.ams.mapper.AssetRequestMapper;
import com.springboot.ams.model.Asset;
import com.springboot.ams.model.AssetRequest;
import com.springboot.ams.model.User;
import com.springboot.ams.repository.AssetRequestRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AssetRequestService {

    private final AssetRequestRepository assetRequestRepository;
    private final AssetRequestMapper assetRequestMapper;
    private final UserService userService;
    private final AssetService assetService;
    private final AssetAllocationService assetAllocationService;

    public AssetRequestRespDto addRequest(AssetRequestDto dto, String employeeUsername, int assetId) {
        // Fetch employee from DB based on given username
        User employee = userService.getByUsername(employeeUsername);
        // Fetch asset from DB based on given assetId
        Asset asset = assetService.getById(assetId);
        // Map dto to entity
        AssetRequest assetRequest = assetRequestMapper.dtoToEntity(dto);
        // Attach employee and asset
        assetRequest.setEmployee(employee);
        assetRequest.setAsset(asset);
        // Save
        AssetRequest saved = assetRequestRepository.save(assetRequest);
        return assetRequestMapper.entityToDto(saved);
    }

    public List<AssetRequestRespDto> getAll() {
        return assetRequestRepository.findAll()
                .stream()
                .map(assetRequestMapper::entityToDto)
                .toList();
    }

    public List<AssetRequestRespDto> getMyRequests(String employeeUsername) {
        return assetRequestRepository.findByEmployeeUsername(employeeUsername)
                .stream()
                .map(assetRequestMapper::entityToDto)
                .toList();
    }

    public AssetRequest getById(int id) {
        return assetRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid asset request id"));
    }

    public AssetRequestRespDto approveRequest(int requestId) {
        AssetRequest assetRequest = getById(requestId);
        // Change request status to APPROVED
        assetRequest.setRequestStatus(RequestStatus.APPROVED);
        AssetRequest saved = assetRequestRepository.save(assetRequest);

        // Auto-create allocation on approval
        assetAllocationService.createAllocation(saved.getEmployee(), saved.getAsset());

        return assetRequestMapper.entityToDto(saved);
    }

    public AssetRequestRespDto rejectRequest(int requestId) {
        AssetRequest assetRequest = getById(requestId);
        // Change request status to REJECTED
        assetRequest.setRequestStatus(RequestStatus.REJECTED);
        AssetRequest saved = assetRequestRepository.save(assetRequest);
        return assetRequestMapper.entityToDto(saved);
    }

    public long countAll() {
        return assetRequestRepository.count();
    }

    public long countByStatus(RequestStatus status) {
        return assetRequestRepository.countByRequestStatus(status);
    }

    public long countMyRequestsByStatus(String username, RequestStatus status) {
        return assetRequestRepository.countByEmployeeUsernameAndRequestStatus(username, status);
    }
}
