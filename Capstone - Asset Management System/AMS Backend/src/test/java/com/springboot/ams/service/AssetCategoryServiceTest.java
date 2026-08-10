package com.springboot.ams.service;

import com.springboot.ams.dto.request.CategoryDto;
import com.springboot.ams.exception.ResourceNotFoundException;
import com.springboot.ams.mapper.AssetCategoryMapper;
import com.springboot.ams.model.AssetCategory;
import com.springboot.ams.repository.AssetCategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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
class AssetCategoryServiceTest {

    // Which repository(s) are u mocking
    @Mock
    private AssetCategoryRepository assetCategoryRepository;

    // Mapper is plain logic, used as a real instance (not mocked) -
    // @Spy so Mockito still wires it into the service via @InjectMocks
    @Spy
    private AssetCategoryMapper assetCategoryMapper = new AssetCategoryMapper();

    // In which service are u mocking
    @InjectMocks
    private AssetCategoryService assetCategoryService;

    private AssetCategory category;
    private AssetCategory category1;
    private CategoryDto categoryDto;

    // Common Sample data for all test cases in AssetCategoryService
    // Sequence:- Sample data loads - Test case runs - Sample data deloads
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

        categoryDto = new CategoryDto("Laptops", "Portable computers");
    }

    @Test
    void getAllCategories_MustReturnSomething() {
        when(assetCategoryRepository.findAll()).thenReturn(List.of(category, category1));

        List<AssetCategory> actualCall = assetCategoryService.getAll();

        assertThat(actualCall).hasSize(2);
        assertThat(actualCall.getFirst().getCategoryName()).isEqualToIgnoringCase("laptops");
        assertThat(actualCall.get(1).getCategoryName()).isEqualToIgnoringCase("monitors");
    }

    @Test
    void getAllCategories_ReturnsEmptyList() {
        when(assetCategoryRepository.findAll()).thenReturn(List.of());

        List<AssetCategory> actualCall = assetCategoryService.getAll();

        assertThat(actualCall).isEmpty();
    }

    @Test
    void getById_categoryExists() {
        when(assetCategoryRepository.findById(100)).thenReturn(Optional.of(category));
        when(assetCategoryRepository.findById(200)).thenReturn(Optional.of(category1));

        assertThat(assetCategoryService.getById(100).getId()).isEqualTo(1);
        assertThat(assetCategoryService.getById(200).getId()).isEqualTo(2);

        assertThat(assetCategoryService.getById(100).getCategoryName()).isEqualTo("Laptops");
        assertThat(assetCategoryService.getById(200).getCategoryName()).isEqualTo("Monitors");
    }

    @Test
    void getById_categoryDoesNotExist() {
        when(assetCategoryRepository.findById(100)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assetCategoryService.getById(100))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Invalid category id");
    }

    @Test
    void addCategory_savesAndReturnsCategory() {
        when(assetCategoryRepository.save(any(AssetCategory.class))).thenReturn(category);

        AssetCategory actualCall = assetCategoryService.addCategory(categoryDto);

        assertThat(actualCall.getCategoryName()).isEqualTo("Laptops");
        assertThat(actualCall.getDescription()).isEqualTo("Portable computers");
        verify(assetCategoryRepository, times(1)).save(any(AssetCategory.class));
    }

    @Test
    void updateCategory_categoryExists_updatesFields() {
        CategoryDto updateDto = new CategoryDto("Laptops Updated", "Updated description");
        when(assetCategoryRepository.findById(1)).thenReturn(Optional.of(category));
        when(assetCategoryRepository.save(any(AssetCategory.class))).thenReturn(category);

        AssetCategory actualCall = assetCategoryService.updateCategory(1, updateDto);

        assertThat(actualCall.getCategoryName()).isEqualTo("Laptops Updated");
        assertThat(actualCall.getDescription()).isEqualTo("Updated description");
    }

    @Test
    void updateCategory_categoryDoesNotExist_throwsException() {
        when(assetCategoryRepository.findById(100)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assetCategoryService.updateCategory(100, categoryDto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Invalid category id");

        verify(assetCategoryRepository, never()).save(any(AssetCategory.class));
    }

    @Test
    void deleteCategory_categoryExists_deletesSuccessfully() {
        when(assetCategoryRepository.findById(1)).thenReturn(Optional.of(category));
        doNothing().when(assetCategoryRepository).deleteById(1);

        assetCategoryService.deleteCategory(1);

        verify(assetCategoryRepository, times(1)).deleteById(1);
    }

    @Test
    void deleteCategory_categoryDoesNotExist_throwsException() {
        when(assetCategoryRepository.findById(100)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> assetCategoryService.deleteCategory(100))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Invalid category id");

        verify(assetCategoryRepository, never()).deleteById(anyInt());
    }
}
