import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SearchPage from "./pages/SearchPage";
import ProductList from "./components/ProductList";
import CategoryPage from "./pages/CategoryPage";
import CategoryList from "./components/CategoryList";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import Chatbot from "./components/Chatbot";
import PaymentPage from "./pages/PaymentPage";
import AccountInfoPage from './pages/AccountInfoPage';
import EditAccountPage from "./pages/EditAccountPage";
import OrderPage from "./pages/OrderPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const userCartCount = localStorage.getItem("userCartCount");
  const [cartCount, setCartCount] = useState(userCartCount);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi chạy
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  const handleLogin = () => setIsLoggedIn(true);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage setCartCount={setCartCount} cartCount={cartCount} />
          }
        />
      </Routes>

      <Navbar cartCount={cartCount} />
      <ToastContainer />
      <div className="content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Protected Routes */}
          <Route
            path="/products"
            element={<ProductList setCartCount={setCartCount} />}
          />
          <Route
            path="/product/:id"
            element={<ProductPage setCartCount={setCartCount} />}
          />
          <Route
            path="/cart"
            element={<CartPage setCartCount={setCartCount} />}
          />
          <Route path="/categories" element={<CategoryList />} />
          <Route
            path="/category/:id"
            element={<CategoryPage setCartCount={setCartCount} />}
          />
          <Route
            path="/category-products/:id"
            element={<CategoryProductsPage />}
          />
          <Route
            path="/search-products"
            element={<SearchPage setCartCount={setCartCount} />}
          />
          <Route path="/payment" element={<PaymentPage />} />{" "}
          <Route path="/account-info" element={<AccountInfoPage />} />
          <Route path="/edit-account/:id" element={<EditAccountPage />} />
          <Route path="/orders" element={<OrderPage />} />
        </Routes>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
