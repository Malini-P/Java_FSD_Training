package com.ecomspring.repository;

import java.util.List;
import com.ecomspring.model.Product;
import com.ecomspring.utility.ProductUtility;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

@Repository
public class ProductRepository {

    private final JdbcTemplate jdbcTemplate;
    private final ProductUtility productUtility;

    public ProductRepository(JdbcTemplate jdbcTemplate, ProductUtility productUtility) {
        this.jdbcTemplate = jdbcTemplate;
        this.productUtility = productUtility;
    }

    public void save(Product product) {
        String sql = "insert into products(name, price, stock_quantity, category_id, vendor_id) values (?,?,?,?,?)";
        Object[] values = new Object[]{
                product.getName(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getCategory().getId(),
                product.getVendor().getId()
        };
        jdbcTemplate.update(sql, values);
    }

    public Product getById(int id) {
        String sql = """
                select p.id, p.name, p.price, p.stock_quantity,
                       c.id as category_id, c.name as category_name,
                       v.id as vendor_id, v.name as vendor_name
                from products p
                join categories c on p.category_id = c.id
                join vendors v on p.vendor_id = v.id
                where p.id = ?
                """;
        List<Product> list = jdbcTemplate.query(sql, productUtility, id);
        return list.isEmpty() ? null : list.get(0);
    }

    public void updateStock(int productId, int newQuantity) {
        String sql = "update products set stock_quantity = ? where id = ?";
        Object[] values = new Object[]{newQuantity, productId};
        jdbcTemplate.update(sql, values);
    }


    public Map<String, Integer> countProductsByVendor() {
        String sql = """
                select v.name as vendor_name, count(p.id) as product_count
                from vendors v
                join products p on p.vendor_id = v.id
                group by v.name
                """;

        List<Map.Entry<String, Integer>> entries = jdbcTemplate.query(sql,
                (ResultSet rst, int rowNum) ->
                        Map.entry(rst.getString("vendor_name"), rst.getInt("product_count")));

        Map<String, Integer> result = new HashMap<>();
        for (Map.Entry<String, Integer> entry : entries) {
            result.put(entry.getKey(), entry.getValue());
        }
        return result;
    }
}