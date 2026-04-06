package com.product.ProductManagementApplication.Repository;

import com.product.ProductManagementApplication.Model.Category;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);
    List<Category> findByNameContainingIgnoreCase(String keyword);
    Page<Category> findAll(@NonNull Pageable pageable);
}
