import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function ProductForm({ onSubmit, initialData = {}, loading = false }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    price: initialData.price || '',
    quantity: initialData.quantity || '',
    description: initialData.description || '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'price'
          ? value === '' ? '' : parseFloat(value)
          : name === 'quantity'
          ? value === '' ? '' : parseInt(value, 10)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      setError('Valid price is required');
      return;
    }
    if (formData.quantity === '' || isNaN(formData.quantity) || formData.quantity < 0) {
      setError('Quantity cannot be negative');
      return;
    }

    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Product Name *</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Price *</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price"
          step="0.01"
          min="0"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Quantity *</Form.Label>
        <Form.Control
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Enter quantity"
          min="0"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description (optional)"
          rows={3}
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Product'}
      </Button>
    </Form>
  );
}

export default ProductForm;