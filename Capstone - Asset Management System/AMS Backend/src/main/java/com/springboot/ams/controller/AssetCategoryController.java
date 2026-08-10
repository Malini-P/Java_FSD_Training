package com.springboot.ams.controller;

import com.springboot.ams.dto.request.CategoryDto;
import com.springboot.ams.model.AssetCategory;
import com.springboot.ams.service.AssetCategoryService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class AssetCategoryController {

    private final AssetCategoryService assetCategoryService;

    @PostMapping("/add")
    public AssetCategory addCategory(@Valid @RequestBody CategoryDto dto) {
        return assetCategoryService.addCategory(dto);
    }

    @GetMapping("/all")
    public List<AssetCategory> getAll() {
        return assetCategoryService.getAll();
    }

    @PutMapping("/update/{id}")
    public AssetCategory updateCategory(@PathVariable int id,
                                        @Valid @RequestBody CategoryDto dto) {
        return assetCategoryService.updateCategory(id, dto);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteCategory(@PathVariable int id) {
        assetCategoryService.deleteCategory(id);
    }
}
