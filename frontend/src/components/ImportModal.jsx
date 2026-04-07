import React, { useState } from 'react';
import { Modal, Button, Form, Alert, ProgressBar } from 'react-bootstrap';

/**
 * Import Modal Component
 * Allows users to import products from CSV
 */
function ImportModal({ show, onHide, onImport }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'text/csv') {
      setError('Please select a valid CSV file');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    setImporting(true);
    setProgress(0);
    setError('');

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

      // Expected headers
      const expectedHeaders = ['name', 'price', 'quantity', 'description'];
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));

      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
      }

      const products = [];
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length >= expectedHeaders.length) {
          const product = {
            name: values[headers.indexOf('name')]?.replace(/"/g, '').trim(),
            price: parseFloat(values[headers.indexOf('price')]),
            quantity: parseInt(values[headers.indexOf('quantity')], 10),
            description: values[headers.indexOf('description')]?.replace(/"/g, '').trim() || ''
          };

          if (!product.name || isNaN(product.price) || isNaN(product.quantity)) {
            throw new Error(`Invalid data in row ${i + 1}`);
          }

          products.push(product);
        }
        setProgress(Math.round((i / lines.length) * 100));
      }

      await onImport(products);
      setFile(null);
      onHide();
    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(false);
      setProgress(0);
    }
  };

  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  };

  const handleClose = () => {
    setFile(null);
    setError('');
    setProgress(0);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>📤 Import Products from CSV</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>CSV File</Form.Label>
          <Form.Control
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={importing}
          />
          <Form.Text className="text-muted">
            CSV should have columns: name, price, quantity, description
          </Form.Text>
        </Form.Group>

        {importing && (
          <div className="mb-3">
            <ProgressBar now={progress} label={`${progress}%`} />
          </div>
        )}

        <Alert variant="info">
          <strong>CSV Format:</strong><br />
          name,price,quantity,description<br />
          "Product 1",29.99,100,"Description here"<br />
          "Product 2",49.99,50,"Another description"
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={importing}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleImport}
          disabled={!file || importing}
        >
          {importing ? 'Importing...' : 'Import Products'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ImportModal;