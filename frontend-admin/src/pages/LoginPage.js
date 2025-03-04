import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import api from "../api"; // Import axios instance

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Gọi API để xác thực người dùng
      const response = await api.post("/users/login", { Email: username, Password: password });

      // Kiểm tra phản hồi từ API
      const userId = response.data.UserID;
      if (response.status === 200) {
        localStorage.getItem("userId", userId);
        onLogin(); // Cập nhật trạng thái đăng nhập
        navigate("/admin/management"); // Điều hướng đến trang quản lý
      }
    } catch (error) {
      setError("Tên người dùng hoặc mật khẩu không đúng!");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh" }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom sx={{fontWeight: "bold", mb: 1}}>
          Đăng nhập
        </Typography>
      </Box>
      <TextField
        label="Tên người dùng"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Mật khẩu"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1, mb: 2 }}>
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#fb6f92',
          color: '#000',
          mt: 2,
          '&:hover': {
            backgroundColor: '#FF69B4',
          },
        }}
        fullWidth
        onClick={handleLogin}
      >
        Đăng nhập
      </Button>
    </Container>
  );
}

export default LoginPage;
