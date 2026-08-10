package com.springboot.ams.controller;

import com.springboot.ams.dto.request.AssetRequestDto;
import com.springboot.ams.dto.response.AssetRequestRespDto;
import com.springboot.ams.service.AssetRequestService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/asset-requests")
@CrossOrigin(origins = "http://localhost:5173")
public class AssetRequestController {

    private final AssetRequestService assetRequestService;

    // Employee raises a request — uses Principal so no need to pass username in request
    @PostMapping("/add/{assetId}")
    public AssetRequestRespDto addRequest(@Valid @RequestBody AssetRequestDto dto,
                                          @PathVariable int assetId,
                                          Principal principal) {
        return assetRequestService.addRequest(dto, principal.getName(), assetId);
    }

    // Employee views their own requests
    @GetMapping("/my")
    public List<AssetRequestRespDto> getMyRequests(Principal principal) {
        return assetRequestService.getMyRequests(principal.getName());
    }

    // Admin views all requests
    @GetMapping("/all")
    public List<AssetRequestRespDto> getAll() {
        return assetRequestService.getAll();
    }

    // Admin approves a request
    @PutMapping("/{id}/approve")
    public AssetRequestRespDto approveRequest(@PathVariable int id) {
        return assetRequestService.approveRequest(id);
    }

    // Admin rejects a request
    @PutMapping("/{id}/reject")
    public AssetRequestRespDto rejectRequest(@PathVariable int id) {
        return assetRequestService.rejectRequest(id);
    }
}
