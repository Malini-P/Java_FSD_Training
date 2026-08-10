package com.springboot.ams.controller;

import com.springboot.ams.dto.response.CategoryDetailDto;
import com.springboot.ams.dto.response.CategoryWithCountDto;
import com.springboot.ams.model.Asset;
import com.springboot.ams.model.AssetCategory;
import com.springboot.ams.repository.AssetRepository;
import com.springboot.ams.service.AssetCategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AssetCategoryControllerV2Test {

    @Mock
    private AssetCategoryService assetCategoryService;

    @Mock
    private AssetRepository assetRepository;

    @InjectMocks
    private AssetCategoryControllerV2 assetCategoryControllerV2;

    private AssetCategory category;
    private AssetCategory category1;

    @BeforeEach
    void sampleData() {

        category = new AssetCategory();
        category.setId(1);
        category.setCategoryName("Laptops");
        category.setDescription("Portable computers");

        category1 = new AssetCategory();
        category1.setId(2);
        category1.setCategoryName("Monitors");
        category1.setDescription("Display devices");
    }

    @Test
    void getCategoryById_ReturnsCategoryDetailDto() {

        when(assetCategoryService.getById(1))
                .thenReturn(category);

        when(assetRepository.getAssetsByCategoryId(1))
                .thenReturn(List.of(new Asset(), new Asset()));

        ResponseEntity<CategoryDetailDto> response =
                assetCategoryControllerV2.getCategoryById(1);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().categoryName()).isEqualTo("Laptops");
        assertThat(response.getBody().totalAssets()).isEqualTo(2);
    }

    @Test
    void searchByName_ReturnsMatchingCategories() {

        when(assetCategoryService.getAll())
                .thenReturn(List.of(category, category1));

        ResponseEntity<List<AssetCategory>> response =
                assetCategoryControllerV2.searchByName("lap");

        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().getFirst().getCategoryName())
                .isEqualTo("Laptops");
    }

    @Test
    void getAllWithAssetCount_ReturnsCategoriesWithCount() {

        when(assetCategoryService.getAll())
                .thenReturn(List.of(category, category1));

        when(assetRepository.getAssetsByCategoryId(1))
                .thenReturn(List.of(new Asset(), new Asset()));

        when(assetRepository.getAssetsByCategoryId(2))
                .thenReturn(List.of(new Asset()));

        ResponseEntity<List<CategoryWithCountDto>> response =
                assetCategoryControllerV2.getAllWithAssetCount();

        assertThat(response.getBody()).hasSize(2);

        assertThat(response.getBody().get(0).assetCount())
                .isEqualTo(2);

        assertThat(response.getBody().get(1).assetCount())
                .isEqualTo(1);
    }
}