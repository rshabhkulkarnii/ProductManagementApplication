import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

/**
 * Sort Bar Component
 * Allows users to sort products by different criteria
 */
function SortBar({ onSort }) {
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = () => {
    onSort(sortBy, sortDirection);
  };

  const sortOptions = [
    { value: 'id', label: 'ID' },
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'quantity', label: 'Stock' },
    { value: 'createdAt', label: 'Date Created' },
    { value: 'updatedAt', label: 'Date Updated' }
  ];

  return (
    <Form className="mb-3">
      <Row className="align-items-end">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Sort By</Form.Label>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Direction</Form.Label>
            <Form.Select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
            >
              <option value="asc">Ascending ↑</option>
              <option value="desc">Descending ↓</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Button variant="primary" onClick={handleSort} className="w-100">
            🔄 Sort
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default SortBar;