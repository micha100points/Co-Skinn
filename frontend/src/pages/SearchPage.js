import React from "react";
import { useLocation } from "react-router-dom";
import { CardActionArea,Box, Typography, Grid, Card, CardContent, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProductActions from "../components/ProductAction";

function SearchPage({ setCartCount }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { filteredProducts } = location.state || { filteredProducts: [] };

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <Box textAlign="center" marginTop="100px">
        <Typography variant="h5">Không tìm thấy sản phẩm nào!</Typography>
      </Box>
    );
  }

  return (
    <Box padding="20px" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Kết quả tìm kiếm
      </Typography>
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.ProductID}>
            <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}>
            <CardActionArea onClick={() => navigate(`/product/${product.ProductID}`)}>
              <CardMedia
                component="img"
                height="200"
                image={product.ImageURL || "placeholder.jpg"} // Đường dẫn ảnh sản phẩm
                alt={product.ProductName}
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
              <CardContent style={{ flexGrow: 1, textAlign: "center" }}>
                <Typography variant="h6">{product.ProductName}</Typography>
                <Typography variant="body1" color="text.primary">
                      Giá: {product.Price.toLocaleString("vi-VN")} VND
                    </Typography>
              </CardContent>
              </CardActionArea>
                          {/* Tích hợp ProductActions */}
            <ProductActions product={product} setCartCount={setCartCount} />

            </Card>
            
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SearchPage;
