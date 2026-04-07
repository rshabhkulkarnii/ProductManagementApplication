import React, { useState, useEffect, useCallback } from 'react';
import { Button, Alert, Spinner, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import productAPI from '../services/api';
import ProductList from '../components/ProductList';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import StatsCard from '../components/StatsCard';
import SortBar from '../components/SortBar';
import BulkActions from '../components/BulkActions';
import ExportMenu from '../components/ExportMenu';
import PrintButton from '../components/PrintButton';
import ImportModal from '../components/ImportModal';

/**
 * Home Page
 * Main page showing all products with search and filter capabilities
 */
function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filter and search states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [stockFilter, setStockFilter] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');

  // Bulk selection
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Modals
  const [showImportModal, setShowImportModal] = useState(false);

  /**
   * Fetch products based on current filters
   */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      let response;

      if (searchKeyword) {
        response = await productAPI.searchProducts(searchKeyword, page, 10);
      } else if (priceFilter.min || priceFilter.max) {
        const minPrice = priceFilter.min || 0;
        const maxPrice = priceFilter.max || 999999999;
        response = await productAPI.filterByPriceRange(minPrice, maxPrice, page, 10);
      } else if (stockFilter) {
        response = await productAPI.getLowStockProducts(stockFilter, page, 10);
      } else {
        response = await productAPI.getAllProducts(page, 10, sortBy, sortDirection);
      }

      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchKeyword, priceFilter, stockFilter, sortBy, sortDirection]);

  // Fetch products whenever filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /**
   * Handle product delete
   */
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  /**
   * Handle search
   */
  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    setPage(0);
    setPriceFilter({ min: '', max: '' });
    setStockFilter('');
  };

  /**
   * Handle price filter
   */
  const handlePriceFilter = (min, max) => {
    setPriceFilter({ min, max });
    setPage(0);
    setSearchKeyword('');
    setStockFilter('');
  };

  /**
   * Handle stock filter
   */
  const handleStockFilter = (threshold) => {
    setStockFilter(threshold);
    setPage(0);
    setSearchKeyword('');
    setPriceFilter({ min: '', max: '' });
  };

  /**
   * Handle sorting
   */
  const handleSort = (newSortBy, newSortDirection) => {
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
    setPage(0);
  };

  /**
   * Handle bulk delete
   */
  const handleBulkDelete = async (productIds) => {
    try {
      // Delete multiple products
      await Promise.all(productIds.map(id => productAPI.deleteProduct(id)));
      setProducts(products.filter(p => !productIds.includes(p.id)));
      setSelectedProducts([]);
      toast.success(`Successfully deleted ${productIds.length} product(s)`);
    } catch (err) {
      toast.error('Failed to delete some products');
    }
  };

  /**
   * Handle import
   */
  const handleImport = async (importedProducts) => {
    try {
      await Promise.all(importedProducts.map(product => productAPI.createProduct(product)));
      toast.success(`Successfully imported ${importedProducts.length} product(s)`);
      fetchProducts(); // Refresh the list
    } catch (err) {
      toast.error('Failed to import some products');
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1>📦 Product Management System</h1>
          <p className="text-muted">Total Products: {totalElements}</p>
        </Col>
        <Col className="text-end">
          <Button variant="outline-secondary" className="me-2" onClick={() => setShowImportModal(true)}>
            📤 Import CSV
          </Button>
          <Link to="/products/create">
            <Button variant="success" size="lg">
              ➕ Create New Product
            </Button>
          </Link>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      {/* Search and Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <SearchBar onSearch={handleSearch} />
        </Col>
        <Col md={6}>
          <FilterBar 
            onPriceFilter={handlePriceFilter}
            onStockFilter={handleStockFilter}
          />
        </Col>
      </Row>

      {/* Active Filters Display */}
      {(searchKeyword || priceFilter.min || priceFilter.max || stockFilter) && (
        <Alert variant="info" dismissible onClose={() => {
          setSearchKeyword('');
          setPriceFilter({ min: '', max: '' });
          setStockFilter('');
        }}>
          <strong>Active Filters:</strong>
          {searchKeyword && ` Search: "${searchKeyword}"`}
          {(priceFilter.min || priceFilter.max) && 
            ` Price: ₹${priceFilter.min || 0} - ₹${priceFilter.max || 'unlimited'}`}
          {stockFilter && ` Low Stock: Below ${stockFilter} units`}
        </Alert>
      )}

      {!loading && products.length > 0 && (
        <Row className="mb-4">
          <Col>
            <StatsCard products={products} />
          </Col>
        </Row>
      )}

      {/* Sort Bar */}
      {!loading && products.length > 0 && (
        <Row className="mb-3">
          <Col>
            <SortBar onSort={handleSort} />
          </Col>
        </Row>
      )}

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <BulkActions
          selectedProducts={selectedProducts}
          onBulkDelete={handleBulkDelete}
        />
      )}

      {/* Action Buttons */}
      {!loading && products.length > 0 && (
        <Row className="mb-3">
          <Col className="d-flex gap-2">
            <ExportMenu products={products} />
            <PrintButton products={products} />
          </Col>
        </Row>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading products...</p>
        </div>
      )}

      {/* Product List */}
      {!loading && products.length > 0 && (
        <div className="table-responsive">
          <ProductList 
            products={products} 
            onDelete={handleDelete}
            selectedProducts={selectedProducts}
            onSelectionChange={setSelectedProducts}
          />
        </div>
      )}

      {/* No Products Message */}
      {!loading && products.length === 0 && (
        <Alert variant="info" className="text-center">
          <h5>No products found</h5>
          <p className="mb-0">Try adjusting your search or filters</p>
        </Alert>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Row className="mt-5">
          <Col className="d-flex justify-content-center align-items-center gap-3">
            <Button 
              variant="outline-secondary" 
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              ← Previous
            </Button>
            
            <span className="text-muted">
              Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
            </span>
            
            <Button 
              variant="outline-secondary"
              disabled={page === totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              Next →
            </Button>
          </Col>
        </Row>
      )}
      <ImportModal
        show={showImportModal}
        onHide={() => setShowImportModal(false)}
        onImport={handleImport}
      />
    </Container>
  );
}

export default HomePage;