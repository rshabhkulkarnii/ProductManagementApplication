import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Alert, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ProductForm from '../components/ProductForm';
import productAPI from '../services/api';

/**
 * Edit Product Page
 * Allows users to update an existing product
 */
function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch product details on mount
  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await productAPI.getProductById(id);
      setProduct(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  /**
   * Handle form submission
   */
  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError('');
    try {
      await productAPI.updateProduct(id, formData);
      toast.success('Product updated successfully!');
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update product';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Product not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Edit Product</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <ProductForm 
        onSubmit={handleSubmit} 
        initialData={product}
        loading={submitting}
      />
    </Container>
  );
}

export default EditProductPage;