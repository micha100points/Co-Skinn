import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import OrderDetailDialog from "./OrderDetailDialog";
import axios from "axios";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply filters whenever search term, status, or date changes
  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const applyFilters = () => {
    let result = orders;

    // Search filter
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.ShippingAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((order) => order.Status === statusFilter);
    }

    // Date filter (last 7, 30 days, or this year)
    if (dateFilter) {
      const now = new Date();
      result = result.filter((order) => {
        const orderDate = new Date(order.OrderDate);
        switch (dateFilter) {
          case "7days":
            return (now - orderDate) / (1000 * 3600 * 24) <= 7;
          case "30days":
            return (now - orderDate) / (1000 * 3600 * 24) <= 30;
          case "thisYear":
            return orderDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    setFilteredOrders(result);
  };

  const handleDeleteOrder = async () => {
    if (selectedOrder) {
      try {
        await axios.delete(
          `http://localhost:5000/api/orders/${selectedOrder._id}`
        );
        fetchOrders();
        setOpenDeleteConfirm(false);
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ thanh toán":
        return "warning";
      case "Đã thanh toán":
        return "success";
      case "Thanh toán thất bại":
        return "error";
      case "Chờ giao hàng":
        return "info";
      case "Đang giao hàng":
        return "primary";
      case "Giao hàng thành công":
        return "success";
      case "Hủy bởi người dùng":
        return "default";
      case "Hủy bởi người bán":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <motion.div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Quản lý đơn hàng
          </Typography>
        </Box>

        {/* Search and Filter Section */}
        <Paper elevation={2} position="fixed" sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="standard"
                label="Tìm kiếm đơn hàng"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth variant="standard">
                <InputLabel>Trạng Thái</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Trạng Thái"
                >
                  <MenuItem value="">Tất Cả</MenuItem>
                  <MenuItem value="Chờ thanh toán">Chờ Thanh Toán</MenuItem>
                  <MenuItem value="Đã thanh toán">Đã Thanh Toán</MenuItem>
                  <MenuItem value="Thanh toán thất bại">
                    Thanh Toán Thất Bại
                  </MenuItem>
                  <MenuItem value="Chờ giao hàng">Chờ Giao Hàng</MenuItem>
                  <MenuItem value="Đang giao hàng">Đang Giao Hàng</MenuItem>
                  <MenuItem value="Giao hàng thành công">
                    Giao Hàng Thành Công
                  </MenuItem>
                  <MenuItem value="Hủy bởi người dùng">
                    Hủy bởi người dùng
                  </MenuItem>
                  <MenuItem value="Hủy bởi người bán">
                    Hủy bởi người bán
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth variant="standard">
                <InputLabel>Thời Gian</InputLabel>
                <Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  label="Thời Gian"
                >
                  <MenuItem value="">Tất Cả</MenuItem>
                  <MenuItem value="7days">7 Ngày Qua</MenuItem>
                  <MenuItem value="30days">30 Ngày Qua</MenuItem>
                  <MenuItem value="thisYear">Năm Nay</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="textSecondary">
                Tổng: {filteredOrders.length} đơn hàng
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Mã Đơn Hàng</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tổng Tiền</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Địa Chỉ Giao Hàng
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Ngày Đặt</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Trạng Thái</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {filteredOrders.map((order) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell>{order._id}</TableCell>
                      <TableCell>
                        {order.TotalAmount.toLocaleString()} VND
                      </TableCell>
                      <TableCell>{order.ShippingAddress}</TableCell>
                      <TableCell>
                        {new Date(order.OrderDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.Status}
                          color={getStatusColor(order.Status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Chi tiết đơn hàng">
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setSelectedOrder(order);
                              setOpenDetailDialog(true);
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa đơn hàng">
                          <IconButton
                            color="error"
                            onClick={() => {
                              setSelectedOrder(order);
                              setOpenDeleteConfirm(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Delete Confirm Dialog */}
        <Dialog
          open={openDeleteConfirm}
          onClose={() => setOpenDeleteConfirm(false)}
        >
          <DialogTitle>Xóa Đơn Hàng</DialogTitle>
          <DialogContent>
            <Typography>
              Bạn có chắc chắn muốn xóa đơn hàng này không?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteConfirm(false)}>Hủy</Button>
            <Button color="error" onClick={handleDeleteOrder}>
              Xóa
            </Button>
          </DialogActions>
        </Dialog>

        {/* Order Detail Dialog */}
        <OrderDetailDialog
          open={openDetailDialog}
          onClose={() => {
            setOpenDetailDialog(false);
            fetchOrders();
            applyFilters();
          }}
          order={selectedOrder}
        />
      </motion.div>
    </Box>
  );
};

export default OrderManagement;
