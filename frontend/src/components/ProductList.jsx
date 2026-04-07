import React from 'react';
import { Table, Button, Badge, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Product List Component
 * Displays products in a table format with optional bulk selection
 */
function ProductList({ products, onDelete, selectedProducts = [], onSelectionChange }) {
  if (!products || products.length === 0) {
    return <p className="text-muted">No products to display</p>;
  }

  const isSelected = (productId) => selectedProducts.includes(productId);

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(products.map(p => p.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      onSelectionChange([...selectedProducts, productId]);
    } else {
      onSelectionChange(selectedProducts.filter(id => id !== productId));
    }
  };

  const allSelected = products.length > 0 && selectedProducts.length === products.length;
  const someSelected = selectedProducts.length > 0 && selectedProducts.length < products.length;

  return (
    <Table striped bordered hover responsive>
      <thead className="table-dark">
        <tr>
          {onSelectionChange && (
            <th>
              <Form.Check
                type="checkbox"
                checked={allSelected}
                indeterminate={someSelected ? 'true' : undefined}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>
          )}
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => {
          const stockStatus = product.quantity > 10 ? 'In Stock' : 'Low Stock';
          const badgeVariant = product.quantity > 10 ? 'success' : 'warning';

          return (
            <tr key={product.id}>
              {onSelectionChange && (
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={isSelected(product.id)}
                    onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                  />
                </td>
              )}
              <td>{product.id}</td>
              <td>
                <Link to={`/products/${product.id}`} className="text-decoration-none">
                  {product.name}
                </Link>
              </td>
              <td>₹{product.price.toFixed(2)}</td>
              <td>{product.quantity}</td>
              <td>
                <Badge bg={badgeVariant}>{stockStatus}</Badge>
              </td>
              <td>
                <Link to={`/products/${product.id}`}>
                  <Button variant="info" size="sm" className="me-2">
                    👁️ View
                  </Button>
                </Link>
                <Link to={`/products/${product.id}/edit`}>
                  <Button variant="warning" size="sm" className="me-2">
                    ✏️ Edit
                  </Button>
                </Link>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => onDelete(product.id)}
                >
                  🗑️ Delete
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default ProductList;