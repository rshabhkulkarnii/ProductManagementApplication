import React from 'react';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Product Detail Card Component
 * Displays a single product in card format (alternative to table)
 */
function ProductDetail({ product, onDelete }) {
  const stockStatus = product.quantity > 10 ? 'In Stock' : 'Low Stock';
  const badgeVariant = product.quantity > 10 ? 'success' : 'warning';

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Row>
          <Col md={8}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <Card.Title className="mb-1">{product.name}</Card.Title>
                <Badge bg={badgeVariant} className="mb-3">
                  {stockStatus}
                </Badge>
              </div>
            </div>

            {product.description && (
              <Card.Text className="text-muted small mb-3">
                {product.description.substring(0, 100)}
                {product.description.length > 100 ? '...' : ''}
              </Card.Text>
            )}

            <Row>
              <Col xs={6}>
                <h6 className="text-muted">Price</h6>
                <h5 className="text-primary">₹{product.price.toFixed(2)}</h5>
              </Col>
              <Col xs={6}>
                <h6 className="text-muted">Stock</h6>
                <h5>{product.quantity} units</h5>
              </Col>
            </Row>
          </Col>

          <Col md={4} className="text-end">
            <div className="d-grid gap-2">
              <Link to={`/products/${product.id}`}>
                <Button variant="info" size="sm">
                  View Details
                </Button>
              </Link>
              <Link to={`/products/${product.id}/edit`}>
                <Button variant="warning" size="sm">
                  Edit
                </Button>
              </Link>
              <Button 
                variant="danger" 
                size="sm"
                onClick={() => onDelete(product.id)}
              >
                Delete
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>

      <Card.Footer className="bg-light text-muted small">
        Created: {new Date(product.createdAt).toLocaleDateString()}
      </Card.Footer>
    </Card>
  );
}

export default ProductDetail;