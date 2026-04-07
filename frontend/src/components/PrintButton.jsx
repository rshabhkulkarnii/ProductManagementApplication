import React from 'react';
import { Button } from 'react-bootstrap';

/**
 * Print Button Component
 * Allows users to print the product list
 */
function PrintButton({ products, disabled = false }) {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const htmlContent = generatePrintHTML(products);

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const generatePrintHTML = (products) => {
    const currentDate = new Date().toLocaleString();

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Product List - ${currentDate}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .print-date { color: #666; font-size: 0.9em; margin-bottom: 20px; }
            .total { font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Product Management System - Product List</h1>
          <div class="print-date">Generated on: ${currentDate}</div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(product => {
                const status = product.quantity > 10 ? 'In Stock' : 'Low Stock';
                return `
                  <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>₹${product.price.toFixed(2)}</td>
                    <td>${product.quantity}</td>
                    <td>${status}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          <div class="total">
            Total Products: ${products.length}
          </div>
        </body>
      </html>
    `;
  };

  return (
    <Button
      variant="outline-secondary"
      size="sm"
      onClick={handlePrint}
      disabled={disabled || !products || products.length === 0}
      title="Print product list"
    >
      🖨️ Print
    </Button>
  );
}

export default PrintButton;