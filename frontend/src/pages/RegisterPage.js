import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import axios from "axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "user", // Vai trò mặc định
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Xử lý thay đổi giá trị input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Xử lý đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/add", {
        Username: formData.username,
        Email: formData.email,
        Password: formData.password,
        Phone: formData.phone,
        Address: formData.address,
        Role: formData.role,
      });

      if (response.status === 201) {
        navigate("/login"); // Chuyển hướng sau khi đăng ký thành công
      }
    } catch (error) {
      setError("Đã xảy ra lỗi, vui lòng thử lại!");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Đăng ký
        </Typography>
      </Box>

      {/* Form đăng ký */}
      <form onSubmit={handleRegister}>
        <TextField
          label="Tên người dùng"
          fullWidth
          margin="normal"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="Mật khẩu"
          type="password"
          fullWidth
          margin="normal"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          label="Số điện thoại"
          fullWidth
          margin="normal"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <TextField
          label="Địa chỉ"
          fullWidth
          margin="normal"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <TextField
          label="Vai trò"
          fullWidth
          margin="normal"
          name="role"
          value={formData.role}
          onChange={handleChange}
        />

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1, mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#fb6f92",
            color: "#000",
            mt: 2,
            "&:hover": {
              backgroundColor: "#FF69B4",
            },
          }}
          fullWidth
          type="submit"
        >
          Đăng ký
        </Button>
      </form>

      <Box textAlign="center" sx={{ mt: 2 }}>
        <Typography variant="body2">
          Đã có tài khoản?{" "}
          <Button color="primary" onClick={() => navigate("/login")}>
            Đăng nhập ngay
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;
