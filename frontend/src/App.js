import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './pages/homePage';
import Login from './pages/loginPage';
import Register from './pages/registerPage';
import Portfolio from './pages/portfolioPage';
import StockDetail from './pages/stockDetailPage';
import Dashboard from './pages/dashboardPage';

const isAuthenticated = localStorage.getItem("token");

const ProtectedRoute = ({ element }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/portfolio" element={<ProtectedRoute element={<Portfolio />} />} />
        <Route path="/stocks/:symbol" element={<ProtectedRoute element={<StockDetail />} />} />
      </Routes>
    </Router>
  );
}

export default App;
