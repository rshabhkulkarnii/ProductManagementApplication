import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './StatsCard.css';

/**
 * Statistics Dashboard
 * Shows product summary statistics
 */
function StatsCard({ products = [] }) {
  // Calculate statistics
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockCount = products.filter(p => p.quantity < 10).length;
  const averagePrice = totalProducts > 0 
    ? (products.reduce((sum, p) => sum + p.price, 0) / totalProducts).toFixed(2)
    : 0;

  const StatItem = ({ title, value, icon, color }) => (
    <Col lg={3} md={6} className="mb-3">
      <Card className={`stat-card stat-${color}`}>
        <Card.Body>
          <div className="stat-content">
            <div className="stat-icon">{icon}</div>
            <div className="stat-info">
              <h6 className="stat-title">{title}</h6>
              <h3 className="stat-value">{value}</h3>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <div className="stats-section mb-4">
      <h5 className="mb-3">📊 Overview</h5>
      <Row>
        <StatItem 
          title="Total Products" 
          value={totalProducts}
          icon="📦"
          color="primary"
        />
        <StatItem 
          title="Total Stock Value" 
          value={`₹${totalValue.toFixed(2)}`}
          icon="💰"
          color="success"
        />
        <StatItem 
          title="Total Units" 
          value={totalStock}
          icon="📈"
          color="info"
        />
        <StatItem 
          title="Low Stock Items" 
          value={lowStockCount}
          icon="⚠️"
          color="warning"
        />
        <StatItem 
          title="Average Price" 
          value={`₹${averagePrice}`}
          icon="💵"
          color="secondary"
        />
        <StatItem 
          title="High Value Items" 
          value={products.filter(p => p.price > 10000).length}
          icon="💎"
          color="danger"
        />
      </Row>
    </div>
  );
}

export default StatsCard;