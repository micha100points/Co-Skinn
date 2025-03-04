import React from "react";
import { IconButton, Button } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProductActions({ product, setCartCount }) {
  const navigate = useNavigate();
  const handleAddToCart = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast.error("Vui lòng đăng nhập để mua hàng!");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/carts/add/${userId}`,
        {
          ProductID: product.ProductID,
          Quantity: 1,
          Price: product.Price,
        }
      );

      if (response.status === 200) {
        toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
        setCartCount((prevCount) => parseInt(prevCount) + 1); // Tăng số lượng giỏ hàng
        const userCartCount = parseInt(localStorage.getItem("userCartCount"));
        if (userCartCount) {
          localStorage.setItem("userCartCount", userCartCount + 1);
        }
      }
    } catch (error) {
      console.error("Lỗi thêm sản phẩm vào giỏ hàng:", error);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng!");
    }
  };

  const handleBuyNow = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Vui lòng đăng nhập để mua hàng!");
      navigate("/login");
      return;
    }
  };

  return (
    <div
      style={{
        padding: "10px",
        display: "flex",
        alignItems: "space-between",
      }}
    >
      <IconButton sx={{ color: "#fb6f92" }} onClick={handleAddToCart}>
        <AddShoppingCartIcon />
      </IconButton>
      <Button
        variant="outlined"
        sx={{ color: "#fb6f92", borderColor: "#fb6f92", marginLeft: "5rem" }}
        onClick={handleBuyNow}
        
      >
        Mua ngay
      </Button>
    </div>
  );
}

export default ProductActions;
