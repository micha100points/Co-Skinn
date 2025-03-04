import React from "react";
import Slider from "react-slick";
import {
  Grid,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
} from "@mui/material";
import ProductList from "../components/ProductList";
import logo from "../assets/logo.png";
import cocoon from "../assets/cocoon.png";
import shipment from "../assets/shipment.jpg";
import romand from "../assets/romand.jpg";
import srm from "../assets/srm.png";
import kemduong from "../assets/kemduong.jpg";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
function HomePage({ setCartCount, cartCount }) {
  // Dữ liệu mẫu cho các quảng cáo
  const advertisements = [
    {
      id: 1,
      title: "Chào mừng bạn đến với Co-Skin",
      imageUrl: logo,
      description: "Khuyến mãi lớn cho các sản phẩm mới, giảm giá đến 50%.",
    },
    {
      id: 2,
      title: "Mua 1 tặng 1 cho các sản phẩm chăm sóc da!",
      imageUrl: cocoon,
      description: "Cơ hội duy nhất trong năm, không nên bỏ lỡ!",
    },
    {
      id: 3,
      title: "Miễn phí vận chuyển toàn quốc!",
      imageUrl: shipment,
      description: "Chỉ áp dụng cho đơn hàng trên 500K.",
    },
  ];

  // Cấu hình cho slider (carousel)
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const popularCategories = [
    { id: 1, title: "Son môi", imageUrl: romand },
    { id: 2, title: "Kem dưỡng da", imageUrl: kemduong },
    { id: 3, title: "Sữa rửa mặt", imageUrl: srm },
  ];

  return (
    <Container>
      <Navbar cartCount={cartCount} />
      {/* Phần quảng cáo với logo trong slider */}
      <Box sx={{ mb: 4, mt: "8%" }}>
        <Slider {...sliderSettings}>
          {advertisements.map((ad) => (
            <Card key={ad.id}>
              <CardMedia
                component="img"
                height="300"
                image={ad.imageUrl}
                alt={ad.title}
                sx={{
                  objectFit: "cover",
                  width: "100%",
                  maxWidth: "500px",
                  maxHeight: "400px",
                  margin: "auto",
                  mt: 2,
                }}
              />
              <CardContent sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="h5" component="div">
                  {ad.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ad.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Slider>
      </Box>

      {/* Phần hiển thị các loại sản phẩm phổ biến */}
      <Typography
        variant="h6"
        gutterBottom
        textAlign="left"
        sx={{ fontWeight: "bold", color: "#FF1493" }}
      >
        Các loại sản phẩm phổ biến
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {popularCategories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={category.imageUrl}
                alt={category.title}
                sx={{
                  width: "auto",
                  maxHeight: 150,
                  margin: "auto",
                  padding: 2,
                }}
              />
              <CardContent>
                <Typography variant="h6" component="div" textAlign="center">
                  {category.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography
        variant="h6"
        gutterBottom
        textAlign="left"
        sx={{ mt: 4, fontWeight: "bold", color: "#FF1493" }}
      >
        Danh sách sản phẩm nổi bật
      </Typography>
      <ProductList setCartCount={setCartCount} style={{ padding: 30, marginTop: - 40 }} />
      <Footer />
    </Container>
  );
}

export default HomePage;
