import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';

/**
 * Filter Bar Component
 * Allows users to filter products by price range or low stock
 */
function FilterBar({ onPriceFilter, onStockFilter }) {
  const [filterType, setFilterType] = useState('none'); // none, price, stock
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [stockThreshold, setStockThreshold] = useState('');

  /**
   * Handle price filter
   */
  const handlePriceFilter = (e) => {
    e.preventDefault();
    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : 999999999;
      onPriceFilter(min, max);
      setFilterType('price');
    }
  };

  /**
   * Handle stock filter
   */
  const handleStockFilter = (e) => {
    e.preventDefault();
    if (stockThreshold && stockThreshold > 0) {
      onStockFilter(parseInt(stockThreshold));
      setFilterType('stock');
    }
  };

  /**
   * Clear all filters
   */
  const handleClear = () => {
    setMinPrice('');
    setMaxPrice('');
    setStockThreshold('');
    setFilterType('none');
    onPriceFilter('', '');
    onStockFilter('');
  };

  return (
    <Card className="p-3">
      <h6 className="mb-3">Filters</h6>

      {/* Price Range Filter */}
      <Form onSubmit={handlePriceFilter} className="mb-3">
        <h6 className="small">Price Range</h6>
        <Row>
          <Col xs={6}>
            <Form.Control
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              step="0.01"
            />
          </Col>
          <Col xs={6}>
            <Form.Control
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              step="0.01"
            />
          </Col>
        </Row>
        <Button variant="outline-primary" size="sm" type="submit" className="mt-2 w-100">
          Filter by Price
        </Button>
      </Form>

      <hr className="my-2" />

      {/* Low Stock Filter */}
      <Form onSubmit={handleStockFilter} className="mb-3">
        <h6 className="small">Low Stock Alert</h6>
        <Form.Control
          type="number"
          placeholder="Stock threshold (e.g., 5)"
          value={stockThreshold}
          onChange={(e) => setStockThreshold(e.target.value)}
          min="0"
        />
        <Button variant="outline-warning" size="sm" type="submit" className="mt-2 w-100">
          Show Low Stock
        </Button>
      </Form>

      {filterType !== 'none' && (
        <>
          <hr className="my-2" />
          <Button 
            variant="outline-danger" 
            size="sm" 
            onClick={handleClear}
            className="w-100"
          >
            Clear Filters
          </Button>
        </>
      )}
    </Card>
  );
}

export default FilterBar;