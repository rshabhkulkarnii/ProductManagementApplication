package com.product.ProductManagementApplication.Controller;

import com.product.ProductManagementApplication.Service.ProductService;
import com.product.ProductManagementApplication.dto.ProductCreateRequest;
import com.product.ProductManagementApplication.dto.ProductResponse;
import com.product.ProductManagementApplication.dto.ProductUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {

        // Validate pagination parameters
        if (page < 0) {
            page = 0;  // Reset to default if negative
        }
        if (size <= 0) {
            size = 10;  // Reset to default if invalid
        }
        if (size > 100) {
            size = 100;  // Limit max size to prevent large queries
        }

        // Create Sort object based on sortDirection
        Sort.Direction direction = sortDirection.equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortBy);

        // Create Pageable object with page, size, and sort
        Pageable pageable = PageRequest.of(page, size, sort);

        // Call service method
        Page<ProductResponse> products = productService.getAllProducts(pageable);

        // Return with 200 OK status
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {

        // Call service method (throws ProductNotFoundException if not found)
        ProductResponse product = productService.getProductById(id);

        // Return with 200 OK status
        return ResponseEntity.ok(product);
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductCreateRequest request) {

        // Call service method (throws InvalidProductException if invalid)
        ProductResponse createdProduct = productService.createProduct(request);

        // Return with 201 Created status
        // 201 indicates the resource was successfully created
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductUpdateRequest request) {

        // Call service method (throws ProductNotFoundException or InvalidProductException)
        ProductResponse updatedProduct = productService.updateProduct(id, request);

        // Return with 200 OK status
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {

        // Call service method (throws ProductNotFoundException if not found)
        productService.deleteProduct(id);

        // Return with 204 No Content status
        // 204 means success but no content to return
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {

        // Validate pagination parameters
        if (page < 0) {
            page = 0;
        }
        if (size <= 0) {
            size = 10;
        }
        if (size > 100) {
            size = 100;
        }

        // Create Sort object
        Sort.Direction direction = sortDirection.equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortBy);

        // Create Pageable
        Pageable pageable = PageRequest.of(page, size, sort);

        // Call service method (throws InvalidProductException if keyword is empty)
        Page<ProductResponse> searchResults = productService.searchProducts(keyword, pageable);

        // Return with 200 OK
        return ResponseEntity.ok(searchResults);
    }

    @GetMapping("/filter/price-range")
    public ResponseEntity<Page<ProductResponse>> getProductsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {

        // Validate pagination parameters
        if (page < 0) {
            page = 0;
        }
        if (size <= 0) {
            size = 10;
        }
        if (size > 100) {
            size = 100;
        }

        // Create Sort object
        Sort.Direction direction = sortDirection.equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortBy);

        // Create Pageable
        Pageable pageable = PageRequest.of(page, size, sort);

        // Call service method (throws InvalidProductException if range is invalid)
        Page<ProductResponse> priceRangeResults = productService.getProductsByPriceRange(
                minPrice, maxPrice, pageable);

        // Return with 200 OK
        return ResponseEntity.ok(priceRangeResults);
    }

    @GetMapping("/filter/low-stock")
    public ResponseEntity<Page<ProductResponse>> getLowStockProducts(
            @RequestParam Integer threshold,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "quantity") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {

        // Validate pagination parameters
        if (page < 0) {
            page = 0;
        }
        if (size <= 0) {
            size = 10;
        }
        if (size > 100) {
            size = 100;
        }

        // Create Sort object
        Sort.Direction direction = sortDirection.equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;
        Sort sort = Sort.by(direction, sortBy);

        // Create Pageable
        Pageable pageable = PageRequest.of(page, size, sort);

        // Call service method (throws InvalidProductException if threshold is invalid)
        Page<ProductResponse> lowStockResults = productService.getLowStockProducts(threshold, pageable);

        // Return with 200 OK
        return ResponseEntity.ok(lowStockResults);
    }
}
