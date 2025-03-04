import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, children }) => {
  // Nếu chưa đăng nhập, chuyển hướng đến /login
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  // Nếu đã đăng nhập, hiển thị nội dung
  return children;
};

export default ProtectedRoute;
