import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import axios from "axios";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Gọi API để xác thực người dùng
      const response = await axios.post("http://localhost:5000/api/users/login", { Email: username, Password: password });
      
      // Kiểm tra phản hồi từ API
      if (response.status === 200) {
        const userId = response.data.UserID; 
        console.log('UserId:', userId); // Thêm log này để kiểm tra giá trị của userId
        if (userId) { // Kiểm tra xem userId có giá trị không
          localStorage.setItem("userId", userId);
          localStorage.setItem("username", response.data.Username); 
          localStorage.setItem("userCartCount", response.data.userCartCount);
          onLogin();
          navigate("/"); 
          window.location.reload();
        } else {
          console.error('UserId không được trả về từ API');
        }
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
      {/* Thêm liên kết đến trang đăng ký */}
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Bạn chưa có tài khoản?{" "}
        <Link to="/register" style={{ color: "#FF69B4", textDecoration: "none", fontWeight: "bold" }}>
          Đăng ký ngay
        </Link>
      </Typography>
    </Container>
  );
}

export default LoginPage;
