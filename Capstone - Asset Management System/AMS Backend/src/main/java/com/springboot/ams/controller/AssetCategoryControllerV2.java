package com.springboot.ams.controller;

import com.springboot.ams.dto.response.CategoryDetailDto;
import com.springboot.ams.dto.response.CategoryWithCountDto;
import com.springboot.ams.model.AssetCategory;
import com.springboot.ams.repository.AssetRepository;
import com.springboot.ams.service.AssetCategoryService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v2/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class AssetCategoryControllerV2 {

    private final AssetCategoryService assetCategoryService;
    private final AssetRepository assetRepository;

    // Get category by id
    @GetMapping("/get/{id}")
    public ResponseEntity<CategoryDetailDto> getCategoryById(@PathVariable int id) {
        AssetCategory category = assetCategoryService.getById(id);
        int totalAssets = assetRepository.getAssetsByCategoryId(id).size();
        CategoryDetailDto response = new CategoryDetailDto(
                category.getId(),
                category.getCategoryName(),
                category.getDescription(),
                totalAssets,
                "v2"
        );
        return ResponseEntity.ok(response);
    }

    // Search
    @GetMapping("/search")
    public ResponseEntity<List<AssetCategory>> searchByName(@RequestParam String name) {
        List<AssetCategory> filtered = assetCategoryService.getAll().stream()
                .filter(c -> c.getCategoryName().toLowerCase().contains(name.toLowerCase()))
                .toList();
        return ResponseEntity.ok(filtered);
    }

    //Get all categories with  asset counts
    @GetMapping("/all-with-count")
    public ResponseEntity<List<CategoryWithCountDto>> getAllWithAssetCount() {
        List<CategoryWithCountDto> result = new ArrayList<>();
        for (AssetCategory cat : assetCategoryService.getAll()) {
            result.add(new CategoryWithCountDto(
                    cat.getId(),
                    cat.getCategoryName(),
                    cat.getDescription(),
                    assetRepository.getAssetsByCategoryId(cat.getId()).size()
            ));
        }
        return ResponseEntity.ok(result);
    }
}
