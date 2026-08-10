package com.springboot.ams.controller;

import com.springboot.ams.dto.request.AssetDto;
import com.springboot.ams.dto.response.AssetRespDto;
import com.springboot.ams.service.AssetService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/assets")
@CrossOrigin(origins = "http://localhost:5173")
public class AssetController {

    private final AssetService assetService;

    @PostMapping("/add/{categoryId}")
    public AssetRespDto addAsset(@Valid @RequestBody AssetDto dto,
                                 @PathVariable int categoryId) {
        return assetService.addAsset(dto, categoryId);
    }

    // Paginated get all
    @GetMapping("/all")
    public ResponseEntity<Object> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<AssetRespDto> result = assetService.getAllPaginated(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("data", result.getContent());
        response.put("totalPages", result.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-one/{id}")
    public AssetRespDto getById(@PathVariable int id) {
        return assetService.getAssetById(id);
    }

    @GetMapping("/available")
    public List<AssetRespDto> getAvailableAssets() {
        return assetService.getAvailableAssets();
    }

    @PutMapping("/update/{id}/{categoryId}")
    public AssetRespDto updateAsset(@PathVariable int id,
                                    @Valid @RequestBody AssetDto dto,
                                    @PathVariable int categoryId) {
        return assetService.updateAsset(id, dto, categoryId);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAsset(@PathVariable int id) {
        assetService.deleteAsset(id);
        return ResponseEntity.ok("Asset deleted successfully");
    }

    @PostMapping("/{assetId}/upload-image")
    public ResponseEntity<String> uploadImage(@PathVariable int assetId,
                                              @RequestParam("file") MultipartFile file) throws IOException {
        //file is the actual image admin is uploading.
        String savedFileName = assetService.uploadImage(assetId, file);
        return ResponseEntity.ok(savedFileName);
    }
}
