package com.springboot.ams.service;

import com.springboot.ams.dto.request.AssetDto;
import com.springboot.ams.dto.response.AssetRespDto;
import com.springboot.ams.enums.AssetStatus;
import com.springboot.ams.exception.FileInvalidExtensionException;
import com.springboot.ams.exception.FileNotFoundException;
import com.springboot.ams.exception.ResourceNotFoundException;
import com.springboot.ams.mapper.AssetMapper;
import com.springboot.ams.model.Asset;
import com.springboot.ams.model.AssetCategory;
import com.springboot.ams.repository.AssetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssetServiceTest {

    // Which repository(s) are u mocking
    @Mock
    private AssetRepository assetRepository;

    // Mapper is plain logic, used as a real instance (not mocked) -
    // @Spy so Mockito still wires it into the service via manual construction
    @Spy
    private AssetMapper assetMapper = new AssetMapper();

    // AssetCategoryService is a collaborator service, mocked separately
    // since AssetService has no no-arg constructor for @InjectMocks field injection,
    // it is wired explicitly in sampleData()
    @Mock
    private AssetCategoryService assetCategoryService;

    private AssetService assetService;

    private AssetCategory category;
    private Asset asset;
    private Asset asset1;
    private AssetDto assetDto;

    // Common Sample data for all test cases in AssetService
    // Sequence:- Sample data loads - Test case runs - Sample data deloads
    @BeforeEach
    void sampleData() {
        assetService = new AssetService(assetRepository, assetMapper, assetCategoryService);
        // matches asset.image.upload.location in application.properties, set here for the @Value field
        ReflectionTestUtils.setField(assetService, "uploadLocation", System.getProperty("java.io.tmpdir"));

        category = new AssetCategory();
        category.setId(1);
        category.setCategoryName("Laptops");
        category.setDescription("Portable computers");

        asset = new Asset();
        asset.setId(1);
        asset.setAssetName("Dell Laptop");
        asset.setAssetModel("XPS 15");
        asset.setSerialNumber("SN-1");
        asset.setAssetStatus(AssetStatus.AVAILABLE);
        asset.setCategory(category);

        asset1 = new Asset();
        asset1.setId(2);
        asset1.setAssetName("HP Laptop");
        asset1.setAssetModel("Pavilion");
        asset1.setSerialNumber("SN-2");
        asset1.setAssetStatus(AssetStatus.ALLOCATED);
        asset1.setCategory(category);

        assetDto = new AssetDto("Dell Laptop", "XPS 15", "SN-1", AssetStatus.AVAILABLE, null, null, null);
    }

    @Test
    void getAllPaginated_MustReturnSomething() {
        Page<Asset> page = new PageImpl<>(List.of(asset, asset1));
        when(assetRepository.findAll(any(Pageable.class))).thenReturn(page);

        Page<AssetRespDto> actualCall = assetService.getAllPaginated(Pageable.unpaged());

        assertThat(actualCall.getContent()).hasSize(2);
        assertThat(actualCall.getContent().getFirst().assetName()).isEqualTo("Dell Laptop");
    }

    @Test
    void getAll_MustReturnSomething() {
        when(assetRepository.findAll()).thenReturn(List.of(asset, asset1));

        List<AssetRespDto> actualCall = assetService.getAll();

        assertThat(actualCall).hasSize(2);
        assertThat(actualCall.getFirst().assetName()).isEqualTo("Dell Laptop");
        assertThat(actualCall.get(1).assetName()).isEqualTo("HP Laptop");
    }

    @Test
    void getAll_ReturnsEmptyList() {
        when(assetRepository.findAll()).thenReturn(List.of());

        List<AssetRespDto> actualCall = assetService.getAll();

        assertThat(actualCall).isEmpty();
    }

    @Test
    void addAsset_savesAndReturnsAsset() {
        when(assetCategoryService.getById(1)).thenReturn(category);
        when(assetRepository.save(any(Asset.class))).thenReturn(asset);

        AssetRespDto actualCall = assetService.addAsset(assetDto, 1);

        assertThat(actualCall.assetName()).isEqualTo("Dell Laptop");
        assertThat(actualCall.categoryName()).isEqualTo("Laptops");
        verify(assetRepository, times(1)).save(any(Asset.class));
    }

    @Test
    void getById_assetExists() {
        when(assetRepository.findById(1)).thenReturn(Optional.of(asset));

        assertThat(assetService.getById(1).getAssetName()).isEqualTo("Dell Laptop");
    }

    @Test
    void getById_assetDoesNotExist_throwsException() {
        when(assetRepository.findById(100)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assetService.getById(100))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Invalid asset id");
    }

    @Test
    void getAssetById_returnsDto() {
        when(assetRepository.findById(1)).thenReturn(Optional.of(asset));

        AssetRespDto actualCall = assetService.getAssetById(1);

        assertThat(actualCall.assetName()).isEqualTo("Dell Laptop");
        assertThat(actualCall.categoryId()).isEqualTo(1);
    }

    @Test
    void updateAsset_assetExists_updatesFields() {
        AssetDto updateDto = new AssetDto("Dell Updated", "XPS 17", "SN-99", AssetStatus.UNDER_SERVICE, null, null, null);
        when(assetRepository.findById(1)).thenReturn(Optional.of(asset));
        when(assetCategoryService.getById(1)).thenReturn(category);
        when(assetRepository.save(any(Asset.class))).thenReturn(asset);

        AssetRespDto actualCall = assetService.updateAsset(1, updateDto, 1);

        assertThat(actualCall.assetName()).isEqualTo("Dell Updated");
        assertThat(actualCall.assetStatus()).isEqualTo(AssetStatus.UNDER_SERVICE);
    }

    @Test
    void updateAsset_assetDoesNotExist_throwsException() {
        when(assetRepository.findById(100)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assetService.updateAsset(100, assetDto, 1))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Invalid asset id");

        verify(assetRepository, never()).save(any(Asset.class));
    }

    @Test
    void deleteAsset_assetExists_deletesSuccessfully() {
        when(assetRepository.findById(1)).thenReturn(Optional.of(asset));
        doNothing().when(assetRepository).deleteById(1);

        assetService.deleteAsset(1);

        verify(assetRepository, times(1)).deleteById(1);
    }

    @Test
    void deleteAsset_assetDoesNotExist_throwsException() {
        when(assetRepository.findById(100)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assetService.deleteAsset(100))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Invalid asset id");

        verify(assetRepository, never()).deleteById(anyInt());
    }

    @Test
    void getAvailableAssets_MustReturnSomething() {
        when(assetRepository.findByAssetStatus(AssetStatus.AVAILABLE)).thenReturn(List.of(asset));

        List<AssetRespDto> actualCall = assetService.getAvailableAssets();

        assertThat(actualCall).hasSize(1);
        assertThat(actualCall.getFirst().assetStatus()).isEqualTo(AssetStatus.AVAILABLE);
    }

    @Test
    void countAll_returnsCount() {
        when(assetRepository.count()).thenReturn(5L);

        assertThat(assetService.countAll()).isEqualTo(5L);
    }

    @Test
    void countByStatus_returnsCount() {
        when(assetRepository.countByAssetStatus(AssetStatus.AVAILABLE)).thenReturn(3L);

        assertThat(assetService.countByStatus(AssetStatus.AVAILABLE)).isEqualTo(3L);
    }

    @Test
    void uploadImage_validFile_savesSuccessfully() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "laptop.png", "image/png", "dummy-image-bytes".getBytes());
        when(assetRepository.findById(1)).thenReturn(Optional.of(asset));
        when(assetRepository.save(any(Asset.class))).thenReturn(asset);

        assetService.uploadImage(1, file);

        assertThat(asset.getImagePath()).endsWith("_laptop.png");
        verify(assetRepository, times(1)).save(asset);
    }

    @Test
    void uploadImage_emptyFile_throwsFileNotFoundException() {
        MockMultipartFile emptyFile = new MockMultipartFile(
                "file", "laptop.png", "image/png", new byte[0]);
        when(assetRepository.findById(1)).thenReturn(Optional.of(asset));

        assertThatThrownBy(() -> assetService.uploadImage(1, emptyFile))
                .isInstanceOf(FileNotFoundException.class)
                .hasMessage("Please select file to upload");

        verify(assetRepository, never()).save(any(Asset.class));
    }

    @Test
    void uploadImage_invalidExtension_throwsFileInvalidExtensionException() {
        MockMultipartFile badFile = new MockMultipartFile(
                "file", "virus.exe", "application/octet-stream", "data".getBytes());
        when(assetRepository.findById(1)).thenReturn(Optional.of(asset));

        assertThatThrownBy(() -> assetService.uploadImage(1, badFile))
                .isInstanceOf(FileInvalidExtensionException.class)
                .hasMessage("exe not allowed");

        verify(assetRepository, never()).save(any(Asset.class));
    }

    @Test
    void uploadImage_assetDoesNotExist_throwsException() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "laptop.png", "image/png", "dummy".getBytes());
        when(assetRepository.findById(100)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assetService.uploadImage(100, file))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Invalid asset id");
    }
}
