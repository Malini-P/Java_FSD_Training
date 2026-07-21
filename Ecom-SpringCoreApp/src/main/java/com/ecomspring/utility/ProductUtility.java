package com.ecomspring.utility;

import com.ecomspring.model.Category;
import com.ecomspring.model.Product;
import com.ecomspring.model.Vendor;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class ProductUtility implements RowMapper<Product> {

    @Override
    public Product mapRow(ResultSet rst, int rowNum) throws SQLException {
        Category category = new Category();
        category.setId(rst.getInt("category_id"));
        category.setName(rst.getString("category_name"));

        Vendor vendor = new Vendor();
        vendor.setId(rst.getInt("vendor_id"));
        vendor.setName(rst.getString("vendor_name"));

        Product product = new Product();
        product.setId(rst.getInt("id"));
        product.setName(rst.getString("name"));
        product.setPrice(rst.getDouble("price"));
        product.setStockQuantity(rst.getInt("stock_quantity"));
        product.setCategory(category);
        product.setVendor(vendor);

        return product;
    }
}