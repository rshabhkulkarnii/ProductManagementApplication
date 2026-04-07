import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { exportToCSV, exportToJSON, exportToExcel } from '../utils/exportUtils';

/**
 * Export Menu Component
 * Provides options to export product data in different formats
 */
function ExportMenu({ products, disabled = false }) {
  const handleExport = (format) => {
    try {
      switch (format) {
        case 'csv':
          exportToCSV(products);
          break;
        case 'json':
          exportToJSON(products);
          break;
        case 'excel':
          exportToExcel(products);
          break;
        default:
          throw new Error('Unknown export format');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed: ' + error.message);
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="outline-primary"
        size="sm"
        disabled={disabled || !products || products.length === 0}
      >
        📥 Export
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleExport('csv')}>
          📄 Export as CSV
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleExport('json')}>
          📋 Export as JSON
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleExport('excel')}>
          📊 Export as Excel
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ExportMenu;