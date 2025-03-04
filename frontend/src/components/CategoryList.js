import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Typography, Paper, Grid } from "@mui/material";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh mục:", error);
      });
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: 'rgba(253, 246, 249, 0.9)'}}>
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          marginBottom: "30px",
          mt: 10,
          fontWeight: "600", // Nhẹ hơn và thanh thoát hơn
          letterSpacing: "2px",
          fontFamily: "Poppins, sans-serif", // Font chữ thanh lịch
          background: "linear-gradient(90deg, #FFC1CC, #FF85A1)", // Màu hồng pastel dễ chịu
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent", // Hiệu ứng chuyển màu mềm mại
          textShadow: "1px 1px 3px rgba(0, 0, 0, 0.1)", // Bóng mờ nhẹ nhàng
        }}
      >
        Danh mục sản phẩm
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={category._id}>
            <Paper
              elevation={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#FFFFFF",
                borderRadius: "15px",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 16px 32px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#333" }}
              >
                <Link
                  to={`/category/${category.CategoryID}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {category.CategoryName}
                </Link>
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  marginTop: "10px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {category.Description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default CategoryList;
