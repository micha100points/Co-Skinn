import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AccountInfoPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Khởi tạo điều hướng

  const userID = localStorage.getItem("userId"); // Thay đổi nếu cần lấy ID động từ context hoặc localStorage

  useEffect(() => {
    // Gọi API để lấy thông tin tài khoản
    const fetchAccountInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/details/${userID}`
        );
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Lỗi khi tải dữ liệu");
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, [userID]);

  const handleEditInfo = () => {
    // Chuyển hướng đến trang chỉnh sửa thông tin
    navigate(`/edit-account/${userID}`);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ bgcolor: "#FFE5EC" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ bgcolor: "#FFE5EC" }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: "20px auto",
        padding: "16px",
        bgcolor: "#FFE5EC",  // Màu nền chính
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ color: "#FF4D94", fontWeight: "bold", mt: "50px" }}
      >
        Thông tin tài khoản
      </Typography>

      <Card sx={{ bgcolor: "#fff", borderRadius: "8px", marginBottom: "20px" }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: "#FF4D94", fontWeight: "bold" }}>
            Tên người dùng
          </Typography>
          <Typography variant="body1" gutterBottom>
            {userData.user.Username}
          </Typography>

          <Typography variant="h6" sx={{ color: "#FF4D94", fontWeight: "bold" }}>
            Email
          </Typography>
          <Typography variant="body1" gutterBottom>
            {userData.user.Email}
          </Typography>

          <Typography variant="h6" sx={{ color: "#FF4D94", fontWeight: "bold" }}>
            Số điện thoại
          </Typography>
          <Typography variant="body1" gutterBottom>
            {userData.user.Phone}
          </Typography>

          <Typography variant="h6" sx={{ color: "#FF4D94", fontWeight: "bold" }}>
            Địa chỉ
          </Typography>
          <Typography variant="body1" gutterBottom>
            {userData.user.Address}
          </Typography>

          <Typography variant="h6" sx={{ color: "#FF4D94", fontWeight: "bold" }}>
            Vai trò
          </Typography>
          <Typography variant="body1" gutterBottom>
            {userData.user.Role}
          </Typography>

          <Box marginTop={2}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#FF4D94",
                color: "#fff",
                "&:hover": { bgcolor: "#FF1A66" },
              }}
              fullWidth
              onClick={handleEditInfo} // Gọi hàm chuyển hướng
            >
              Chỉnh sửa thông tin
            </Button>
          </Box>
        </CardContent>
      </Card>

      {userData.cart && userData.cart.Products ? (
        <Box marginTop={4}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#FF4D94", fontWeight: "bold" }}
          >
            Thông tin giỏ hàng
          </Typography>

          <Card sx={{ bgcolor: "#fff", borderRadius: "8px" }}>
            <CardContent>
              <Grid container spacing={2}>
                {userData.cart.Products.length > 0 ? (
                  userData.cart.Products.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card
                        sx={{
                          bgcolor: "#fff",
                          borderRadius: "8px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          padding: "16px",
                        }}
                      >
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography
                                variant="h6"
                                sx={{ color: "#FF4D94", fontWeight: "bold" }}
                              >
                                {product.Name}
                              </Typography>
                              <Typography variant="body2">
                                ID: {product.ProductID}
                              </Typography>
                              <Typography variant="body2">
                                Số lượng: {product.Quantity}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Typography variant="body1" sx={{ textAlign: "center" }}>
                    Giỏ hàng trống
                  </Typography>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Box marginTop={4}>
          <Typography variant="body1">Không có giỏ hàng liên kết</Typography>
        </Box>
      )}
    </Box>
  );
};

export default AccountInfoPage;
