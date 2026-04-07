import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Container, Alert, Spinner, Card, Button, Row, Col, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import productAPI from '../services/api';

/**
 * Product Detail Page
 * Shows detailed information about a single product
 */
function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch product on mount
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
   * Handle delete
   */
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(id);
        toast.success('Product deleted successfully!');
        navigate('/');
      } catch (err) {
        const errorMessage = 'Failed to delete product';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  // Product not found
  if (!product) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Product not found</Alert>
        <Link to="/">
          <Button variant="primary">Back to Products</Button>
        </Link>
      </Container>
    );
  }

  // Determine stock status
  const stockStatus = product.quantity > 10 ? 'In Stock' : 'Low Stock';
  const stockBadgeVariant = product.quantity > 10 ? 'success' : 'warning';

  return (
    <Container className="mt-4">
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <Card.Title className="mb-2">{product.name}</Card.Title>
                  <Badge bg={stockBadgeVariant}>{stockStatus}</Badge>
                </div>
              </div>

              {product.description && (
                <Card.Text className="mb-4">
                  <strong>Description:</strong>
                  <br />
                  {product.description}
                </Card.Text>
              )}

              <div className="mb-4">
                <Row>
                  <Col sm={6}>
                    <h5>Price</h5>
                    <h3 className="text-primary">₹{product.price.toFixed(2)}</h3>
                  </Col>
                  <Col sm={6}>
                    <h5>Stock Quantity</h5>
                    <h3 className={product.quantity > 10 ? 'text-success' : 'text-warning'}>
                      {product.quantity} units
                    </h3>
                  </Col>
                </Row>
              </div>

              <div className="border-top pt-4">
                <p className="text-muted">
                  <small>
                    <strong>Created:</strong> {new Date(product.createdAt).toLocaleString()}
                    <br />
                    <strong>Last Updated:</strong> {new Date(product.updatedAt).toLocaleString()}
                  </small>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <h5 className="mb-3">Actions</h5>

              <Link to={`/products/${product.id}/edit`} className="d-grid mb-2">
                <Button variant="warning">✏️ Edit Product</Button>
              </Link>

              <Button 
                variant="danger" 
                className="d-grid mb-3"
                onClick={handleDelete}
              >
                🗑️ Delete Product
              </Button>

              <Link to="/" className="d-grid">
                <Button variant="secondary">← Back to Products</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetailPage;