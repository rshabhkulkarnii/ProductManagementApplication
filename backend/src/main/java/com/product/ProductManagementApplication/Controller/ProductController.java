package com.product.ProductManagementApplication.Controller;

import com.product.ProductManagementApplication.dto.ProductCreateRequest;
import com.product.ProductManagementApplication.dto.ProductResponse;
import com.product.ProductManagementApplication.Service.FirebaseProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

/**
 * Product REST Controller
 * Uses Firebase Firestore instead of MySQL
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    @Autowired
    private FirebaseProductService firebaseProductService;
    
    /**
     * Get all products with pagination
     */
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> products = firebaseProductService.getAllProducts(pageable);
        return ResponseEntity.ok(products);
    }
    
    /**
     * Get product by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable String id) {
        ProductResponse product = firebaseProductService.getProductById(id);
        return ResponseEntity.ok(product);
    }
    
    /**
     * Create product
     */
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductCreateRequest request) {
        ProductResponse product = firebaseProductService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }
    
    /**
     * Update product
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable String id,
            @RequestBody ProductCreateRequest request) {
        
        ProductResponse product = firebaseProductService.updateProduct(id, request);
        return ResponseEntity.ok(product);
    }
    
    /**
     * Delete product
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        firebaseProductService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Search products by keyword
     */
    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> results = firebaseProductService.searchProducts(keyword, pageable);
        return ResponseEntity.ok(results);
    }
    
    /**
     * Filter by price range
     */
    @GetMapping("/filter/price-range")
    public ResponseEntity<Page<ProductResponse>> filterByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> results = firebaseProductService
            .getProductsByPriceRange(minPrice, maxPrice, pageable);
        return ResponseEntity.ok(results);
    }
    
    /**
     * Get low stock products
     */
    @GetMapping("/filter/low-stock")
    public ResponseEntity<Page<ProductResponse>> getLowStockProducts(
            @RequestParam Integer threshold,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductResponse> results = firebaseProductService
            .getLowStockProducts(threshold, pageable);
        return ResponseEntity.ok(results);
    }
}