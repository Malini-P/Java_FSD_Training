package com.springboot.ams.service;

import com.springboot.ams.dto.request.AssetDto;
import com.springboot.ams.dto.response.AssetRespDto;
import com.springboot.ams.enums.AssetStatus;
import com.springboot.ams.exception.InvalidFilePathException;
import com.springboot.ams.exception.ResourceNotFoundException;
import com.springboot.ams.mapper.AssetMapper;
import com.springboot.ams.model.Asset;
import com.springboot.ams.model.AssetCategory;
import com.springboot.ams.repository.AssetRepository;
import com.springboot.ams.utility.FileUtility;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class AssetService {

    private final AssetRepository assetRepository;
    private final AssetMapper assetMapper;
    private final AssetCategoryService assetCategoryService;

    @Value("${asset.image.upload.location}")
    private String uploadLocation;

    public AssetService(AssetRepository assetRepository,
                        AssetMapper assetMapper,
                        AssetCategoryService assetCategoryService) {
        this.assetRepository     = assetRepository;
        this.assetMapper         = assetMapper;
        this.assetCategoryService = assetCategoryService;
    }

    // Paginated get all — used by ManageAssets in frontend
    public Page<AssetRespDto> getAllPaginated(Pageable pageable) {
        return assetRepository.findAll(pageable)
                .map(assetMapper::entityToDto);
    }

    public List<AssetRespDto> getAll() {
        return assetRepository.findAll()
                .stream()
                .map(assetMapper::entityToDto)
                .toList();
    }

    public AssetRespDto addAsset(AssetDto dto, int categoryId) {
        // Fetch the category from DB based on given categoryId
        AssetCategory category = assetCategoryService.getById(categoryId);
        // Map dto to Entity
        Asset asset = assetMapper.dtoToEntity(dto);
        // Attach category to asset
        asset.setCategory(category);
        // Save the entity
        Asset saved = assetRepository.save(asset);
        return assetMapper.entityToDto(saved);
    }

    public Asset getById(int id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid asset id"));
    }

    public AssetRespDto getAssetById(int id) {
        return assetMapper.entityToDto(getById(id));
    }

    public AssetRespDto updateAsset(int id, AssetDto dto, int categoryId) {
        Asset existingAsset = getById(id);
        AssetCategory category = assetCategoryService.getById(categoryId);
        existingAsset.setAssetName(dto.assetName());
        existingAsset.setAssetModel(dto.assetModel());
        existingAsset.setSerialNumber(dto.serialNumber());
        existingAsset.setAssetStatus(dto.assetStatus());
        existingAsset.setCategory(category);
        existingAsset.setManufacturingDate(dto.manufacturingDate());
        existingAsset.setExpiryDate(dto.expiryDate());
        existingAsset.setAssetValue(dto.assetValue());
        Asset saved = assetRepository.save(existingAsset);
        return assetMapper.entityToDto(saved);
    }

    public void deleteAsset(int id) {
        getById(id); // validation
        assetRepository.deleteById(id);
    }

    public List<AssetRespDto> getAvailableAssets() {
        return assetRepository.findByAssetStatus(AssetStatus.AVAILABLE)
                .stream()
                .map(assetMapper::entityToDto)
                .toList();
    }

    public long countAll() {
        return assetRepository.count();
    }

    public long countByStatus(AssetStatus status) {
        return assetRepository.countByAssetStatus(status);
    }

    public String uploadImage(int assetId, MultipartFile file) throws IOException {
        // Fetch asset by id
        Asset asset = getById(assetId);
        // Validate file — only png, jpeg, jpg allowed
        FileUtility.validateFile(file);
        // Create the upload path directory if not exists
        Path uploadPath = Paths.get(uploadLocation).normalize();
        Files.createDirectories(uploadPath);
        // Attach the file name to the upload path
        String fileName = UUID.randomUUID() + "_" +
                Paths.get(Objects.requireNonNull(file.getOriginalFilename())).getFileName().toString();
        Path destinationPath = uploadPath.resolve(fileName).normalize();
        if (!destinationPath.startsWith(uploadPath)) {
            throw new InvalidFilePathException("Invalid file path");
        }
        // Copy the original file (Multipart) onto destination upload path
        Files.copy(file.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);
        // Save the file name in DB
        asset.setImagePath(fileName);
        assetRepository.save(asset);
        return fileName;
    }
}
