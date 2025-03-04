import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductManagement from './pages/ProductManagement';
import CategoryManagement from './pages/CategoryManagement';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import OrderManagement from './pages/OrderManagement';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi chạy
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  const handleLogin = () => setIsLoggedIn(true);
    
    return (
        <Router>
            {isLoggedIn && <Navbar />}
            <Routes>
                <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
                <Route
                    path="/admin/management"
                    element={ <HomePage /> }
                />
                <Route
                    path="/products"
                    element={<ProductManagement /> }
                />
                <Route
                    path="/categories"
                    element={ <CategoryManagement />}
                />
                <Route
                    path="/orders"
                    element={ <OrderManagement />}
                />
            </Routes>
        </Router>
    );
}

export default App;
