import React, { useState } from "react";
import { Avatar, Box, Typography, Button, Menu, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng

const UserMenu = ({ username }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate(); // Khởi tạo điều hướng

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Xóa dữ liệu đã lưu trong localStorage
    localStorage.clear();
    navigate("/login");
    window.location.reload();
    // Đóng menu
    handleMenuClose();
  };

  const handleUserHistory = () => {
    // Điều hướng đến trang lịch sử người dùng
    navigate("/orders");
    handleMenuClose(); // Đóng menu sau khi điều hướng
  };

  const handleAccountInfo = () => {
    // Điều hướng đến trang thông tin tài khoản
    navigate("/account-info");
    handleMenuClose(); // Đóng menu sau khi điều hướng
  };

  return (
    <div>
      {username ? (
        <Box
          sx={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
          onClick={handleMenuOpen}
        >
          <Avatar sx={{ bgcolor: "#C71585" }}>{username[0]}</Avatar>
          <Typography variant="body1" sx={{ color: "#fff" }}>
            {username}
          </Typography>
        </Box>
      ) : (
        <Button color="inherit" component={Link} to="/login">
          Đăng nhập
        </Button>
      )}

      {/* Menu khi bấm vào Avatar hoặc Username */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* Thêm chức năng điều hướng đến Lịch sử người dùng */}
        <MenuItem onClick={handleUserHistory}>Đơn Hàng</MenuItem>
        <MenuItem onClick={handleAccountInfo}>Thông tin tài khoản</MenuItem>
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenu;
