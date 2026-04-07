import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import NavigationBar from './components/NavigationBar';
import './App.css';

// Import pages
import HomePage from './pages/HomePage';
import CreateProductPage from './pages/CreateProductPage';
import EditProductPage from './pages/EditProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import FeatureRequestPage from './pages/FeatureRequestPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <NavigationBar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/create" element={<CreateProductPage />} />
            <Route path="/products/:id/edit" element={<EditProductPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/feature-requests" element={<FeatureRequestPage />} />
          </Routes>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;