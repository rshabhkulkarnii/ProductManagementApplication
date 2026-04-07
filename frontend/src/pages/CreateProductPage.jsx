import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ProductForm from '../components/ProductForm';
import productAPI from '../services/api';

function CreateProductPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    try {
      await productAPI.createProduct(formData);
      toast.success('Product created successfully!');
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create product';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Create New Product</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <ProductForm onSubmit={handleSubmit} loading={loading} />
    </Container>
  );
}

export default CreateProductPage;