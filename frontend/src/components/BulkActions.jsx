import React from 'react';
import { Button, Alert } from 'react-bootstrap';

/**
 * Bulk Actions Component
 * Provides bulk delete functionality for selected products
 */
function BulkActions({ selectedProducts, onBulkDelete, disabled = false }) {
  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) {
      alert('Please select products to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)?`)) {
      onBulkDelete(selectedProducts);
    }
  };

  if (selectedProducts.length === 0) {
    return null;
  }

  return (
    <Alert variant="warning" className="d-flex justify-content-between align-items-center">
      <span>
        <strong>{selectedProducts.length}</strong> product(s) selected
      </span>
      <Button
        variant="danger"
        size="sm"
        onClick={handleBulkDelete}
        disabled={disabled}
      >
        🗑️ Delete Selected
      </Button>
    </Alert>
  );
}

export default BulkActions;