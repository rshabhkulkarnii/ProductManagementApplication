package com.product.ProductManagementApplication.Repository;

import com.product.ProductManagementApplication.Model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {

    // ============ SIMPLE QUERIES (Single Result) ============
    Optional<Product> findByName(String name);
    Optional<Product> findByNameIgnoreCase(String name);


    // ============ PAGINATED SEARCH QUERIES ============
    Page<Product> findByNameContainingIgnoreCase(String keyword, Pageable pageable);
    Page<Product> findByDescriptionContainingIgnoreCase(String description, Pageable pageable);


    // ============ PAGINATED PRICE QUERIES ============
    Page<Product> findByPriceGreaterThan(BigDecimal price, Pageable pageable);
    Page<Product> findByPriceLessThan(BigDecimal price, Pageable pageable);
    Page<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);


    // ============ PAGINATED QUANTITY QUERIES ============
    Page<Product> findByQuantityLessThan(Integer quantity, Pageable pageable);


    // ============ COMBINED QUERIES (List - No Pagination) ============
    List<Product> findByNameAndPriceGreaterThan(String name, BigDecimal price);
    List<Product> findByNameAndQuantity(String name, Integer quantity);


    // ============ LIMITED/SORTED QUERIES (List) ============
    List<Product> findTop5ByOrderByPriceDesc();
    List<Product> findByQuantityLessThanOrderByPriceDesc(Integer quantity);
}