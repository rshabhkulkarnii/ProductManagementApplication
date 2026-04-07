package com.product.ProductManagementApplication.Model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_name" , length = 255 , nullable = false)
    private String name;

    @Column(name = "description" , length = 255 , nullable = true)
    private String description;

    @Column(name = "price" , nullable = false , precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @CreationTimestamp
    @Column(name = "created_at" , nullable = false , updatable = false)
    private LocalDateTime creationDate;

    @UpdateTimestamp
    @Column(name = "updated_at" ,  nullable = false)
    private LocalDateTime updateDate;

    @ManyToOne
    @JoinColumn(name = "category_id" ,  nullable = true)
    private Category category;

    public Product() {
    }

    public Product(String name, String description, BigDecimal price, Integer quantity, Category category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
    }
}
