import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import "./CartPage.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const CartPage = ({ setCartCount }) => {
  const [cart, setCart] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/carts/${userId}`
        );
        setCart(response.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, [userId]);

  const updateQuantity = async (userId, productId, quantity) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/carts/update-quantity",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            productId,
            quantity,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCart(data.cart);
      } else {
        // Nếu có lỗi, hiển thị thông báo
        setError(data.error || "An error occurred while updating the cart.");
      }
    } catch (error) {
      setError("An error occurred while communicating with the server.");
      console.error(error);
    }
  };
  const handleIncreaseQuantity = (productId, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    updateQuantity(userId, productId, newQuantity);
  };

  const handleDecreaseQuantity = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      updateQuantity(userId, productId, newQuantity);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/carts/remove/${userId}/${productId}`
      );
      toast.success("Xóa sản phẩm thành công!");
      setCart(response.data);
      setCartCount((prevCount) => response.data.Products.lenght);
      localStorage.setItem("userCartCount", response.data.Products.lenght);
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };
  const handleCheckout = () => {
    // Chuyển hướng đến trang PaymentPage
    navigate("/payment", { state: { cart } });
  };

  if (!cart) {
    return <div>Đang cập nhật giỏ hàng...</div>;
  }

  return (
    <div className="cart-container">
      <Typography variant="h5" gutterBottom>
        Giỏ hàng
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Sản phẩm</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Số lượng</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Giá</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Thành tiền</strong>
            </TableCell>
            <TableCell align="center">
              <strong></strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.Products.map((product) => (
            <TableRow key={product.ProductID}>
              <TableCell>{product.ProductName}</TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={() =>
                    handleDecreaseQuantity(product.ProductID, product.Quantity)
                  }
                >
                  <RemoveIcon />
                </IconButton>
                <span>{product.Quantity}</span>
                <IconButton
                  onClick={() =>
                    handleIncreaseQuantity(product.ProductID, product.Quantity)
                  }
                >
                  <AddIcon />
                </IconButton>
              </TableCell>
              <TableCell align="center">
                {product.Price.toLocaleString()} VND
              </TableCell>
              <TableCell align="center">
                {(product.Price * product.Quantity).toLocaleString()} VND
              </TableCell>
              <TableCell align="center">
                <IconButton
                  color="error"
                  onClick={() => handleRemoveProduct(product.ProductID)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Typography
        variant="h6"
        className="total-amount"
        style={{ marginTop: "20px" }}
      >
        Tổng cộng:{" "}
        {cart.Products.reduce(
          (total, product) => total + product.Price * product.Quantity,
          0
        ).toLocaleString()}{" "}
        VND
      </Typography>

      <Button
        variant="contained"
        onClick={handleCheckout}
        fullWidth
        style={{ marginTop: "20px", backgroundColor: "#fb6f92" }}
      >
        Thanh Toán
      </Button>
    </div>
  );
};

export default CartPage;
