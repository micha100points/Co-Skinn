import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Paper,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";

const OrderDetailDialog = ({ open, order, onClose }) => {
  const [status, setStatus] = useState(order?.Status || "Chờ thanh toán");

  const handleStatusUpdate = async () => {
    if (!order) return;

    try {
      await axios.put(
        `http://localhost:5000/api/orders/update-status/${order._id}`,
        { Status: status }
      );
      onClose(); // Close dialog after update
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (!order) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      component={motion.div}
      transition={{ duration: 0.3 }}
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>Chi tiết đơn hàng</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin đơn hàng
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="textSecondary">
                  Mã đơn hàng:
                </Typography>
                <Typography variant="body2">{order._id}</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="textSecondary">
                  Ngày đặt hàng:
                </Typography>
                <Typography variant="body2">
                  {new Date(order.OrderDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="textSecondary">
                  Đơn giá:
                </Typography>
                <Typography variant="body2">
                  {order.TotalAmount.toLocaleString()} VND
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin khách hàng
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="textSecondary">
                  Mã khách hàng:
                </Typography>
                <Typography variant="body2">{order.UserID}</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="textSecondary">
                  Địa chỉ:
                </Typography>
                <Typography variant="body2">{order.ShippingAddress}</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="textSecondary">
                  Phương thức thanh toán:
                </Typography>
                <Typography variant="body2">{order.PaymentMethod}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6">Trạng thái đơn hàng</Typography>
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 250 }}
                >
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    label="Trạng Thái"
                  >
                    <MenuItem value="Chờ thanh toán">Chờ thanh toán</MenuItem>
                    <MenuItem value="Đã thanh toán">Đã thanh toán</MenuItem>
                    <MenuItem value="Thanh toán thất bại">
                      Thanh toán thất bại
                    </MenuItem>
                    <MenuItem value="Chờ giao hàng">Chờ giao hàng</MenuItem>
                    <MenuItem value="Đang giao hàng">Đang giao hàng</MenuItem>
                    <MenuItem value="Giao hàng thành công">
                      Giao hàng thành công
                    </MenuItem>
                    <MenuItem value="Hủy bởi người bán">
                      Hủy bởi người bán
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
        <Button
          onClick={handleStatusUpdate}
          color="primary"
          variant="contained"
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailDialog;
