package com.ecomspring.service;

import com.ecomspring.model.Product;
import com.ecomspring.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public void save(Product product) {
        productRepository.save(product);
    }

    public Product getById(int id) {
        return productRepository.getById(id);
    }

    public void updateStock(int productId, int newQuantity) {
        productRepository.updateStock(productId, newQuantity);
    }

    public Map<String, Integer> countProductsByVendor() {
        return productRepository.countProductsByVendor();
    }
}
