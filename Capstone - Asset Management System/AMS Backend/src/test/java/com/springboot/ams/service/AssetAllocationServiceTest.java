package com.springboot.ams.service;

import com.springboot.ams.dto.response.AllocationRespDto;
import com.springboot.ams.enums.AssetStatus;
import com.springboot.ams.exception.ResourceNotFoundException;
import com.springboot.ams.mapper.AssetAllocationMapper;
import com.springboot.ams.model.Asset;
import com.springboot.ams.model.AssetAllocation;
import com.springboot.ams.model.User;
import com.springboot.ams.repository.AssetAllocationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssetAllocationServiceTest {

    // Which repository(s) are u mocking
    @Mock
    private AssetAllocationRepository assetAllocationRepository;

    // Mapper is plain logic, used as a real instance (not mocked) -
    // @Spy so Mockito still wires it into the service via @InjectMocks
    @Spy
    private AssetAllocationMapper assetAllocationMapper = new AssetAllocationMapper();

    // AssetService is injected but not invoked by the methods under test,
    // so it is left null - skip mocking what isn't worth testing here
    @InjectMocks
    private AssetAllocationService assetAllocationService;

    private User employee;
    private Asset asset;
    private AssetAllocation allocation;
    private AssetAllocation allocation1;

    // Common Sample data for all test cases in AssetAllocationService
    // Sequence:- Sample data loads - Test case runs - Sample data deloads
    @BeforeEach
    void sampleData() {
        employee = new User();
        employee.setId(1);
        employee.setUsername("john");

        asset = new Asset();
        asset.setId(1);
        asset.setAssetName("Dell Laptop");
        asset.setAssetModel("XPS 15");
        asset.setAssetStatus(AssetStatus.AVAILABLE);

        allocation = new AssetAllocation();
        allocation.setId(1);
        allocation.setEmployee(employee);
        allocation.setAsset(asset);
        allocation.setReturned(false);

        allocation1 = new AssetAllocation();
        allocation1.setId(2);
        allocation1.setEmployee(employee);
        allocation1.setAsset(asset);
        allocation1.setReturned(true);
    }

    @Test
    void createAllocation_savesAllocation_andMarksAssetAllocated() {
        ArgumentCaptor<AssetAllocation> captor = ArgumentCaptor.forClass(AssetAllocation.class);
        when(assetAllocationRepository.save(any(AssetAllocation.class))).thenReturn(allocation);

        AssetAllocation actualCall = assetAllocationService.createAllocation(employee, asset);

        verify(assetAllocationRepository).save(captor.capture());
        AssetAllocation savedAllocation = captor.getValue();

        assertThat(savedAllocation.getEmployee()).isEqualTo(employee);
        assertThat(savedAllocation.getAsset()).isEqualTo(asset);
        assertThat(savedAllocation.isReturned()).isFalse();
        assertThat(asset.getAssetStatus()).isEqualTo(AssetStatus.ALLOCATED);
        assertThat(actualCall).isEqualTo(allocation);
    }

    @Test
    void getAll_MustReturnSomething() {
        when(assetAllocationRepository.findAll()).thenReturn(List.of(allocation, allocation1));

        List<AllocationRespDto> actualCall = assetAllocationService.getAll();

        assertThat(actualCall).hasSize(2);
        assertThat(actualCall.getFirst().assetName()).isEqualToIgnoringCase("dell laptop");
        assertThat(actualCall.getFirst().returned()).isFalse();
        assertThat(actualCall.get(1).returned()).isTrue();
    }

    @Test
    void getAll_ReturnsEmptyList() {
        when(assetAllocationRepository.findAll()).thenReturn(List.of());

        List<AllocationRespDto> actualCall = assetAllocationService.getAll();

        assertThat(actualCall).isEmpty();
    }

    @Test
    void getMyAllocations_MustReturnSomething() {
        when(assetAllocationRepository.findByEmployeeUsername("john")).thenReturn(List.of(allocation));

        List<AllocationRespDto> actualCall = assetAllocationService.getMyAllocations("john");

        assertThat(actualCall).hasSize(1);
        assertThat(actualCall.getFirst().employeeUsername()).isEqualTo("john");
    }

    @Test
    void returnAsset_allocationExists_marksReturned_andAssetAvailable() {
        asset.setAssetStatus(AssetStatus.ALLOCATED);
        when(assetAllocationRepository.findById(1)).thenReturn(Optional.of(allocation));
        when(assetAllocationRepository.save(any(AssetAllocation.class))).thenReturn(allocation);

        AllocationRespDto actualCall = assetAllocationService.returnAsset(1);

        assertThat(actualCall.returned()).isTrue();
        assertThat(asset.getAssetStatus()).isEqualTo(AssetStatus.AVAILABLE);
    }

    @Test
    void returnAsset_allocationDoesNotExist_throwsException() {
        when(assetAllocationRepository.findById(100)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assetAllocationService.returnAsset(100))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Invalid allocation id");

        verify(assetAllocationRepository, never()).save(any(AssetAllocation.class));
    }

    @Test
    void countMyActiveAllocations_returnsCount() {
        when(assetAllocationRepository.countByEmployeeUsernameAndReturnedFalse("john")).thenReturn(3L);

        long actualCall = assetAllocationService.countMyActiveAllocations("john");

        assertThat(actualCall).isEqualTo(3L);
    }
}
