package com.ecomspring;

import com.ecomspring.model.Category;
import com.ecomspring.model.Product;
import com.ecomspring.model.Vendor;
import com.ecomspring.service.ProductService;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import java.util.Map;

public class App {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext context
                = new AnnotationConfigApplicationContext(AppConfig.class);

        ProductService productService = context.getBean(ProductService.class);

        System.out.println("---------- Save Product ----------");
        Category category = new Category();
        category.setId(1);  // must already exist in categories table

        Vendor vendor = new Vendor();
        vendor.setId(1);    // must already exist in vendors table

        Product product = new Product("Wireless Mouse", 599.00, 50, category, vendor);
        productService.save(product);
        System.out.println("Product saved..");

        System.out.println("---------- Get Product by Id ----------");
        Product fetched = productService.getById(1);
        System.out.println(fetched);

        System.out.println("---------- Update Stock ----------");
        productService.updateStock(1, 75);
        System.out.println("Stock updated..");
        System.out.println(productService.getById(1));

        System.out.println("---------- Count Products by Vendor ----------");
        Map<String, Integer> countMap = productService.countProductsByVendor();
        countMap.forEach((vendorName, count) ->
                System.out.println(vendorName + " -> " + count));

        context.close();
    }
}
