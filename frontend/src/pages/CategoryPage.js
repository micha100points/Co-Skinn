import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ProductActions from "../components/ProductAction";

function CategoryPage({ setCartCount }) {
  const { id } = useParams(); // Lấy ID của category từ URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("categoryId: ", id); // Log để kiểm tra categoryId

    // Gọi API để lấy các sản phẩm theo categoryId
    axios
      .get(`http://localhost:5000/api/products/category/${id}`)
      .then((response) => {
        setProducts(response.data); // Lưu các sản phẩm vào state
        setLoading(false); // Đã tải xong
      })
      .catch((error) => {
        setError("Lỗi khi lấy sản phẩm.");
        setLoading(false); // Đã tải xong, dù có lỗi
      });
  }, [id]); // Chạy lại khi `id` thay đổi

  if (loading) return <div>Đang tải sản phẩm...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "20px", marginTop: "40px" }}>
      <h2>Sản phẩm trong danh mục</h2>
      <Grid container spacing={3} justifyContent="center">
        {products.length === 0 ? (
          <p>Không có sản phẩm nào trong danh mục này.</p>
        ) : (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id} >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardActionArea onClick={() => navigate(`/product/${product.ProductID}`)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.ImageURL || "default-image.jpg"} // Dự phòng hình ảnh nếu không có
                    alt={product.ProductName}
                  />
                  <CardContent style={{ flexGrow: 1, textAlign: "center" }}>
                    <Typography variant="h6" gutterBottom>
                      {product.ProductName}
                    </Typography>
                    <Typography variant="body1" color="text.primary">
                      Giá: {product.Price.toLocaleString("vi-VN")} VND
                    </Typography>
                  </CardContent>
                </CardActionArea>
                {/* Tích hợp ProductActions */}
                <ProductActions product={product} setCartCount={setCartCount} />
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
}

export default CategoryPage;
