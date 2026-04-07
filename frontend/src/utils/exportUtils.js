/**
 * Export utilities for product data
 */

/**
 * Export products to CSV
 * @param {Array} products - Array of product objects
 * @param {string} filename - Output filename
 */
export const exportToCSV = (products, filename = 'products.csv') => {
  if (!products || products.length === 0) {
    throw new Error('No products to export');
  }

  const headers = ['ID', 'Name', 'Price', 'Quantity', 'Description', 'Created At', 'Updated At'];
  const csvContent = [
    headers.join(','),
    ...products.map(product => [
      product.id,
      `"${product.name.replace(/"/g, '""')}"`,
      product.price,
      product.quantity,
      `"${(product.description || '').replace(/"/g, '""')}"`,
      product.createdAt,
      product.updatedAt
    ].join(','))
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
};

/**
 * Export products to JSON
 * @param {Array} products - Array of product objects
 * @param {string} filename - Output filename
 */
export const exportToJSON = (products, filename = 'products.json') => {
  if (!products || products.length === 0) {
    throw new Error('No products to export');
  }

  const jsonContent = JSON.stringify(products, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
};

/**
 * Export products to Excel (simplified as CSV for now)
 * @param {Array} products - Array of product objects
 * @param {string} filename - Output filename
 */
export const exportToExcel = (products, filename = 'products.xlsx') => {
  // For now, export as CSV with .xlsx extension
  // In a real app, you'd use a library like xlsx
  exportToCSV(products, filename.replace('.xlsx', '.csv'));
};

/**
 * Helper function to download a file
 * @param {string} content - File content
 * @param {string} filename - Filename
 * @param {string} mimeType - MIME type
 */
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};