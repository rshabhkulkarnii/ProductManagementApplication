package com.product.ProductManagementApplication.Service;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.product.ProductManagementApplication.dto.ProductCreateRequest;
import com.product.ProductManagementApplication.dto.ProductResponse;
import com.product.ProductManagementApplication.Model.Product;
import com.product.ProductManagementApplication.Exception.ProductNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Product Service with Firebase Firestore
 * Replaces JPA repository with Firestore
 */
@Service
public class FirebaseProductService {
    
    private static final Logger logger = LoggerFactory.getLogger(FirebaseProductService.class);
    private static final String PRODUCTS_COLLECTION = "products";
    
    @Autowired
    private Firestore firestore;
    
    /**
     * Get all products with pagination
     */
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        try {
            logger.info("Fetching all products from Firestore...");
            
            QuerySnapshot querySnapshot = firestore
                .collection(PRODUCTS_COLLECTION)
                .get()
                .get();
            
            // Convert to ProductResponse
            List<ProductResponse> products = querySnapshot.getDocuments().stream()
                .map(doc -> doc.toObject(Product.class))
                .map(this::convertEntityToResponse)
                .collect(Collectors.toList());
            
            logger.info("✅ Fetched {} products", products.size());
            
            // Apply pagination manually
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), products.size());
            
            List<ProductResponse> paginatedList = products.subList(start, end);
            
            return new PageImpl<>(paginatedList, pageable, products.size());
            
        } catch (Exception e) {
            logger.error("❌ Error fetching products: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch products", e);
        }
    }
    
    /**
     * Get product by ID
     */
    public ProductResponse getProductById(String id) {
        try {
            logger.info("Fetching product with ID: {}", id);
            
            DocumentSnapshot doc = firestore
                .collection(PRODUCTS_COLLECTION)
                .document(id)
                .get()
                .get();
            
            if (!doc.exists()) {
                throw new ProductNotFoundException("Product not found with ID: " + id);
            }
            
            Product product = doc.toObject(Product.class);
            logger.info("✅ Found product: {}", product.getName());
            
            return convertEntityToResponse(product);
            
        } catch (Exception e) {
            logger.error("❌ Error fetching product: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch product", e);
        }
    }
    
    /**
     * Create new product
     */
    public ProductResponse createProduct(ProductCreateRequest request) {
        try {
            logger.info("Creating product: {}", request.getName());
            
            // Validate request
            validateProductCreateRequest(request);
            
            // Create product entity
            Product product = new Product();
            product.setId(UUID.randomUUID().toString()); // Generate UUID
            product.setName(request.getName());
            product.setDescription(request.getDescription());
            product.setPrice(request.getPrice());
            product.setQuantity(request.getQuantity());
            product.setCreatedAt(LocalDateTime.now());
            product.setUpdatedAt(LocalDateTime.now());
            
            // Save to Firestore
            firestore
                .collection(PRODUCTS_COLLECTION)
                .document(product.getId())
                .set(product)
                .get();
            
            logger.info("✅ Product created with ID: {}", product.getId());
            
            return convertEntityToResponse(product);
            
        } catch (Exception e) {
            logger.error("❌ Error creating product: {}", e.getMessage());
            throw new RuntimeException("Failed to create product", e);
        }
    }
    
    /**
     * Update product
     */
    public ProductResponse updateProduct(String id, ProductCreateRequest request) {
        try {
            logger.info("Updating product with ID: {}", id);
            
            // Check if product exists
            DocumentSnapshot doc = firestore
                .collection(PRODUCTS_COLLECTION)
                .document(id)
                .get()
                .get();
            
            if (!doc.exists()) {
                throw new ProductNotFoundException("Product not found with ID: " + id);
            }
            
            // Get existing product
            Product product = doc.toObject(Product.class);
            
            // Update fields
            if (request.getName() != null) product.setName(request.getName());
            if (request.getDescription() != null) product.setDescription(request.getDescription());
            if (request.getPrice() != null) product.setPrice(request.getPrice());
            if (request.getQuantity() != null) product.setQuantity(request.getQuantity());
            
            product.setUpdatedAt(LocalDateTime.now());
            
            // Save to Firestore
            firestore
                .collection(PRODUCTS_COLLECTION)
                .document(id)
                .set(product)
                .get();
            
            logger.info("✅ Product updated: {}", product.getName());
            
            return convertEntityToResponse(product);
            
        } catch (Exception e) {
            logger.error("❌ Error updating product: {}", e.getMessage());
            throw new RuntimeException("Failed to update product", e);
        }
    }
    
    /**
     * Delete product
     */
    public void deleteProduct(String id) {
        try {
            logger.info("Deleting product with ID: {}", id);
            
            firestore
                .collection(PRODUCTS_COLLECTION)
                .document(id)
                .delete()
                .get();
            
            logger.info("✅ Product deleted: {}", id);
            
        } catch (Exception e) {
            logger.error("❌ Error deleting product: {}", e.getMessage());
            throw new RuntimeException("Failed to delete product", e);
        }
    }
    
    /**
     * Search products by name
     */
    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        try {
            logger.info("Searching products with keyword: {}", keyword);
            
            QuerySnapshot querySnapshot = firestore
                .collection(PRODUCTS_COLLECTION)
                .get()
                .get();
            
            // Filter manually (Firestore doesn't support LIKE)
            List<ProductResponse> products = querySnapshot.getDocuments().stream()
                .map(doc -> doc.toObject(Product.class))
                .filter(p -> p.getName().toLowerCase().contains(keyword.toLowerCase()) ||
                            p.getDescription().toLowerCase().contains(keyword.toLowerCase()))
                .map(this::convertEntityToResponse)
                .collect(Collectors.toList());
            
            logger.info("✅ Found {} products matching '{}'", products.size(), keyword);
            
            // Apply pagination
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), products.size());
            
            List<ProductResponse> paginatedList = products.subList(start, end);
            
            return new PageImpl<>(paginatedList, pageable, products.size());
            
        } catch (Exception e) {
            logger.error("❌ Error searching products: {}", e.getMessage());
            throw new RuntimeException("Failed to search products", e);
        }
    }
    
    /**
     * Filter products by price range
     */
    public Page<ProductResponse> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        try {
            logger.info("Filtering products by price: {} - {}", minPrice, maxPrice);
            
            QuerySnapshot querySnapshot = firestore
                .collection(PRODUCTS_COLLECTION)
                .get()
                .get();
            
            // Filter manually
            List<ProductResponse> products = querySnapshot.getDocuments().stream()
                .map(doc -> doc.toObject(Product.class))
                .filter(p -> p.getPrice().compareTo(minPrice) >= 0 && 
                            p.getPrice().compareTo(maxPrice) <= 0)
                .map(this::convertEntityToResponse)
                .collect(Collectors.toList());
            
            logger.info("✅ Found {} products in price range", products.size());
            
            // Apply pagination
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), products.size());
            
            List<ProductResponse> paginatedList = products.subList(start, end);
            
            return new PageImpl<>(paginatedList, pageable, products.size());
            
        } catch (Exception e) {
            logger.error("❌ Error filtering by price: {}", e.getMessage());
            throw new RuntimeException("Failed to filter products", e);
        }
    }
    
    /**
     * Get low stock products
     */
    public Page<ProductResponse> getLowStockProducts(Integer threshold, Pageable pageable) {
        try {
            logger.info("Fetching low stock products (threshold: {})", threshold);
            
            QuerySnapshot querySnapshot = firestore
                .collection(PRODUCTS_COLLECTION)
                .get()
                .get();
            
            // Filter manually
            List<ProductResponse> products = querySnapshot.getDocuments().stream()
                .map(doc -> doc.toObject(Product.class))
                .filter(p -> p.getQuantity() < threshold)
                .map(this::convertEntityToResponse)
                .collect(Collectors.toList());
            
            logger.info("✅ Found {} low stock products", products.size());
            
            // Apply pagination
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), products.size());
            
            List<ProductResponse> paginatedList = products.subList(start, end);
            
            return new PageImpl<>(paginatedList, pageable, products.size());
            
        } catch (Exception e) {
            logger.error("❌ Error fetching low stock products: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch low stock products", e);
        }
    }
    
    /**
     * Convert Product entity to ProductResponse DTO
     */
    private ProductResponse convertEntityToResponse(Product product) {
        return ProductResponse.builder()
            .id(Long.parseLong(product.getId().replaceAll("[^0-9]", "0"))) // Convert UUID to Long
            .name(product.getName())
            .description(product.getDescription())
            .price(product.getPrice())
            .quantity(product.getQuantity())
            .createdAt(product.getCreatedAt())
            .updatedAt(product.getUpdatedAt())
            .build();
    }
    
    /**
     * Validate product creation request
     */
    private void validateProductCreateRequest(ProductCreateRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RuntimeException("Product name is required");
        }
        if (request.getPrice() == null || request.getPrice().doubleValue() < 0) {
            throw new RuntimeException("Product price must be positive");
        }
        if (request.getQuantity() == null || request.getQuantity() < 0) {
            throw new RuntimeException("Product quantity must be non-negative");
        }
    }
}
