import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ProductActions from "./ProductAction";

function ProductList({ setCartCount }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 16;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/page?page=${currentPage}&limit=${productsPerPage}`
        );
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages); // Backend cần trả về tổng số trang
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <Grid
      container
      spacing={3}
      justifyContent="center"
      style={{ padding: 30, marginTop: 45 }}
    >
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product.ProductID}>
          <Card
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardActionArea
              component={Link}
              to={`/product/${product.ProductID}`}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.ImageURL}
                alt={product.ProductName}
                style={{ objectFit: "contain", objectPosition: "center" }}
              />
              <CardContent style={{ flexGrow: 1, textAlign: "center", paddingnBottom: "0rem" }}>
                <Typography variant="h7">
                  {product.ProductName}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  Giá: {product.Price.toLocaleString("vi-VN")} VND
                </Typography>
              </CardContent>
            </CardActionArea>

            {/* Tích hợp ProductActions */}
            <ProductActions product={product} setCartCount={setCartCount} />
          </Card>
        </Grid>
      ))}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          style={{ marginRight: "10px" }}
          color="primary"
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="body1" style={{ margin: "0 10px" }}>
          Trang {currentPage} / {totalPages}
        </Typography>

        <IconButton
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{ marginLeft: "10px" }}
          color="primary"
        >
          <ArrowForwardIcon />
        </IconButton>
      </div>
    </Grid>
  );
}

export default ProductList;
