package com.springboot.ams.mapper;

import com.springboot.ams.dto.request.CategoryDto;
import com.springboot.ams.model.AssetCategory;
import org.springframework.stereotype.Component;

@Component
public class AssetCategoryMapper {

    public AssetCategory dtoToEntity(CategoryDto dto) {
        AssetCategory category = new AssetCategory();
        category.setCategoryName(dto.categoryName());
        category.setDescription(dto.description());
        return category;
    }
}
