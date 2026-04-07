package com.product.ProductManagementApplication.Service;

import com.product.ProductManagementApplication.Exception.InvalidProductException;
import com.product.ProductManagementApplication.Exception.ProductNotFoundException;
import com.product.ProductManagementApplication.Model.Product;
import com.product.ProductManagementApplication.Repository.ProductRepo;
import com.product.ProductManagementApplication.dto.ProductCreateRequest;
import com.product.ProductManagementApplication.dto.ProductResponse;
import com.product.ProductManagementApplication.dto.ProductUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ProductService {

    //Dependency Injection
    private final ProductRepo productRepo;

    //Constructor
    public ProductService(ProductRepo productRepo) {
        this.productRepo = productRepo;
    }

    //Conversion helper Functions
    private ProductResponse convertEntityToResponse(Product product) {
        ProductResponse productResponse = new ProductResponse();

        productResponse.setId(product.getId());
        productResponse.setName(product.getName());
        productResponse.setDescription(product.getDescription());
        productResponse.setPrice(product.getPrice());
        productResponse.setQuantity(product.getQuantity());
        productResponse.setCreatedAt(product.getCreationDate());
        productResponse.setUpdatedAt(product.getUpdateDate());

        return productResponse;
    }

    private Product convertCreateRequestToEntity(ProductCreateRequest request) {
        validateProduct(request);
        Product product = new Product();

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        return product;
    }

    private void updateEntityFromRequest(ProductUpdateRequest request, Product product) {
        validateUpdateRequest(request);

        if (request.getName() != null) {
            validateName(request.getName());
            product.setName(request.getName());
        }

        if (request.getDescription() != null) {
            validateDescription(request.getDescription());
            product.setDescription(request.getDescription());
        }

        if (request.getPrice() != null) {
            validatePrice(request.getPrice());
            product.setPrice(request.getPrice());
        }

        if (request.getQuantity() != null) {
            validateQuantity(request.getQuantity());
            product.setQuantity(request.getQuantity());
        }
    }

    private void validateProduct(ProductCreateRequest request) {

        if(request == null)  {
            throw new InvalidProductException("Product request cannot be null");
        }

        if(request.getName() == null || request.getName().trim().isEmpty()) {
            throw new InvalidProductException("Product name cannot be empty");
        }

        if(request.getName().length() > 255) {
            throw new InvalidProductException("Product name cannot be longer than 255 characters");
        }

        if(request.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidProductException("Product price cannot be negative");
        }

        if(request.getQuantity() == null) {
            throw new InvalidProductException("Product quantity cannot be  null");
        }

        if(request.getQuantity() < 0) {
            throw new InvalidProductException("Product quantity cannot be negative");
        }

        int MAX_QUANTITY = 1000000;
        if(request.getQuantity() > MAX_QUANTITY) {
            throw new InvalidProductException("Product quantity cannot be greater than " + MAX_QUANTITY);
        }

        if(request.getDescription() != null) {

            int MAX_DESCRIPTION = 2000;
            if(request.getDescription().length() > MAX_DESCRIPTION) {
                throw new InvalidProductException("Product description cannot be longer than " + MAX_DESCRIPTION);
            }
        }
    }

    private void validatePrice(BigDecimal price) {
        if(price == null) {
            throw new InvalidProductException("Product price cannot be null");
        }

        if(price.compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidProductException("Product price cannot be negative");
        }

        BigDecimal MAX_PRICE = new  BigDecimal("9999999.99");
        if(price.compareTo(MAX_PRICE) > 0) {
            throw new InvalidProductException("Price exceeds maximum allowed value of " + MAX_PRICE + ". Provided: " + price);
        }

        if(price.scale() > 2) {
            throw new InvalidProductException("Price can have maximum 2 decimal places");
        }
    }

    private void validateQuantity(Integer quantity) {
        if(quantity == null) {
            throw new InvalidProductException("Product quantity cannot be null");
        }

        if(quantity < 0) {
            throw new InvalidProductException("Product quantity cannot be negative, Provided: " + quantity);
        }

        int MAX_QUANTITY = 1000000;
        if(quantity > MAX_QUANTITY) {
            throw new InvalidProductException("Product quantity cannot be greater than " + MAX_QUANTITY);
        }
    }

    private void validateName(String name) {
        if(name == null || name.trim().isEmpty()) {
            throw new InvalidProductException("Product name cannot be empty");
        }

        if(name.length() > 255) {
            throw new InvalidProductException("Product name cannot be longer than 255 characters");
        }
    }

    private void validateDescription(String description) {
        if(description == null) {
            return;
        }

        int MAX_DESCRIPTION_LENGTH = 2000;
        if(description.length() > MAX_DESCRIPTION_LENGTH) {
            throw new InvalidProductException("Product description cannot exceed " + MAX_DESCRIPTION_LENGTH + " characters. Current length: " + description.length());
        }

        if (description.trim().isEmpty()) {
            throw new InvalidProductException("Description cannot contain only whitespace");
        }
    }

    private void validateUpdateRequest(ProductUpdateRequest request) {
        if(request == null) {
            throw new InvalidProductException("Product request cannot be null");
        }

        if (request.getName() == null &&
                request.getDescription() == null &&
                request.getPrice() == null &&
                request.getQuantity() == null) {
            throw new InvalidProductException("At least one field must be provided for update");
        }
    }

    private void validateSearchKeyword(String keyword) {
        if(keyword == null) {
            throw new InvalidProductException("Search keyword cannot be null");
        }

        if (keyword.trim().isEmpty()) {
            throw new InvalidProductException("Search keyword cannot be empty");
        }

        // Check if keyword is too long
        int MAX_KEYWORD_LENGTH = 100;
        if (keyword.length() > MAX_KEYWORD_LENGTH) {
            throw new InvalidProductException("Search keyword cannot exceed " + MAX_KEYWORD_LENGTH + " characters");
        }
    }

    private void validatePriceRange(BigDecimal minPrice, BigDecimal maxPrice) {

        // Check if minPrice is null
        if (minPrice == null) {
            throw new InvalidProductException("Minimum price cannot be null");
        }

        // Check if maxPrice is null
        if (maxPrice == null) {
            throw new InvalidProductException("Maximum price cannot be null");
        }

        // Validate minPrice
        validatePrice(minPrice);

        // Validate maxPrice
        validatePrice(maxPrice);

        // Check if minPrice <= maxPrice
        if (minPrice.compareTo(maxPrice) > 0) {
            throw new InvalidProductException("Minimum price (" + minPrice + ") cannot be greater than maximum price (" + maxPrice + ")");
        }
    }

    private void validateQuantityThreshold(Integer threshold) {

        // Check if threshold is null
        if (threshold == null) {
            throw new InvalidProductException("Quantity threshold cannot be null");
        }

        // Check if threshold is negative
        if (threshold < 0) {
            throw new InvalidProductException("Quantity threshold cannot be negative. Provided: " + threshold);
        }

        // Check if threshold is unreasonably high
        int MAX_THRESHOLD = 1000000;
        if (threshold > MAX_THRESHOLD) {
            throw new InvalidProductException("Quantity threshold cannot exceed " + MAX_THRESHOLD + ". Provided: " + threshold);
        }
    }

    private void validateId(Long id) {

        // Check if ID is null
        if (id == null) {
            throw new InvalidProductException("Product ID cannot be null");
        }

        // Check if ID is less than or equal to zero
        if (id <= 0) {
            throw new InvalidProductException("Product ID must be greater than 0. Provided: " + id);
        }
    }

    public Page<ProductResponse> getAllProducts(Pageable pageable) {

        Page<Product> productsPage = productRepo.findAll(pageable);

        return productsPage.map(this::convertEntityToResponse);
    }

    public ProductResponse getProductById(Long id) {

        // Validate ID
        validateId(id);

        // Find product by ID
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with ID: " + id));

        // Convert to response
        return convertEntityToResponse(product);
    }

    public ProductResponse createProduct(ProductCreateRequest request) {

        // Convert request to entity (includes validation)
        Product product = convertCreateRequestToEntity(request);

        // Save to database
        Product savedProduct = productRepo.save(product);

        // Convert to response and return
        return convertEntityToResponse(savedProduct);
    }

    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {

        // Validate ID
        validateId(id);

        // Find existing product
        Product product = productRepo.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with ID: " + id));

        // Update the entity with request data
        updateEntityFromRequest(request, product);

        // Save updated entity
        Product updatedProduct = productRepo.save(product);

        // Convert to response and return
        return convertEntityToResponse(updatedProduct);
    }

    public void deleteProduct(Long id) {

        // Validate ID
        validateId(id);

        // Check if product exists
        if (!productRepo.existsById(id)) {
            throw new ProductNotFoundException("Product not found with ID: " + id);
        }

        // Delete the product
        productRepo.deleteById(id);
    }

    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {

        // Validate search keyword
        validateSearchKeyword(keyword);

        // Call repository search method
        Page<Product> searchResults = productRepo.findByNameContainingIgnoreCase(keyword, pageable);

        // Convert results to response
        return searchResults.map(this::convertEntityToResponse);
    }

    public Page<ProductResponse> getProductsByPriceRange(BigDecimal minPrice,
                                                         BigDecimal maxPrice,
                                                         Pageable pageable) {

        // Validate price range
        validatePriceRange(minPrice, maxPrice);

        // Call repository method
        Page<Product> priceRangeResults = productRepo.findByPriceBetween(minPrice, maxPrice, pageable);

        // Convert results to response
        return priceRangeResults.map(this::convertEntityToResponse);
    }

    public Page<ProductResponse> getLowStockProducts(Integer threshold, Pageable pageable) {

        // Validate threshold
        validateQuantityThreshold(threshold);

        // Call repository method
        Page<Product> lowStockResults = productRepo.findByQuantityLessThan(threshold, pageable);

        // Convert results to response
        return lowStockResults.map(this::convertEntityToResponse);
    }
}
