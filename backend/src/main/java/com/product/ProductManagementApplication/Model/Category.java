package com.product.ProductManagementApplication.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "categories")
@Data
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category_name" ,  nullable = false)
    private String name;

    @OneToMany( mappedBy = "category", cascade = CascadeType.ALL)
    private List<Product> products;
}
