import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';
import './NavigationBar.css';

/**
 * Navigation Bar Component
 * Displays navbar with theme toggle button
 */
function NavigationBar() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Navbar 
      expand="lg" 
      sticky="top"
      className={`navbar-custom ${isDarkMode ? 'dark' : 'light'}`}
    >
      <Container>
        <Navbar.Brand href="/" className="fw-bold brand-text">
          📦 Product Management System
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/">🏠 Home</Nav.Link>
            <Nav.Link as={Link} to="/products/create">➕ Create Product</Nav.Link>
            <Nav.Link as={Link} to="/feature-requests">💡 Feature Requests</Nav.Link>
            
            {/* Theme Toggle Button */}
            <Button 
              variant={isDarkMode ? 'light' : 'dark'}
              size="sm"
              onClick={toggleTheme}
              className="ms-3 theme-toggle"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;