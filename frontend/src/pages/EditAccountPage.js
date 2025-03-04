import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditAccountPage = () => {
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Phone: "",
    Address: "",
    Role: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const userID = localStorage.getItem("userId")
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        
        const response = await axios.get(
          `http://localhost:5000/api/users/details/${userID}`
        );
        const { Username, Email, Phone, Address, Role } = response.data.user;
        setFormData({ Username, Email, Phone, Address, Role });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Không thể tải thông tin người dùng.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userID]);

  // Xử lý sự kiện thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Gửi dữ liệu đã chỉnh sửa về server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/users/edit/${userID}`,
        formData
      );
      setSuccess("Thông tin đã được cập nhật thành công!");
      setError(null);
      setTimeout(() => {
        navigate(`/account-info`); // Điều hướng trở lại trang thông tin tài khoản
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể cập nhật thông tin.");
      setSuccess(null);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ bgcolor: "#FDEEF4" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "20px auto",
        padding: "16px",
        bgcolor: "#FFF0F5",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ color: "#C71585", fontWeight: "bold" }}
      >
        Chỉnh sửa thông tin
      </Typography>

      {error && (
        <Alert severity="error" sx={{ marginBottom: "16px" }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ marginBottom: "16px" }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Tên người dùng"
          name="Username"
          value={formData.Username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Email"
          name="Email"
          type="email"
          value={formData.Email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Số điện thoại"
          name="Phone"
          value={formData.Phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Địa chỉ"
          name="Address"
          value={formData.Address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Vai trò"
          name="Role"
          value={formData.Role}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <Box marginTop={3}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#C71585",
              color: "#fff",
              "&:hover": { bgcolor: "#D81B60" },
              width: "100%",
            }}
          >
            Lưu thay đổi
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditAccountPage;
