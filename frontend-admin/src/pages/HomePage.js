import { Link } from "react-router-dom";
import { Button, Typography, Box, Container } from "@mui/material";
import backgroundImage from '../assets/logo.png'; // Đảm bảo đã thêm ảnh vào thư mục dự án

function HomePage() {
  return (
    <Container sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between", marginTop: 10}}>
      
      {/* Phần chữ ở đầu */}
      <Box textAlign="center" sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Chào mừng đến với trang quản lý Co-Skin
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Quản lý sản phẩm và danh mục một cách dễ dàng và hiệu quả
        </Typography>
      </Box>
      
      {/* Phần hình ảnh ở dưới */}
      <Box
        component="img"
        src={backgroundImage}
        alt="Co-Skin Logo"
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          width: "80%",
          maxWidth: 500,
          mx: "auto",
          mb: 4,
          objectFit: "contain",
        }}
      />
    </Container>
  );
}

export default HomePage;
