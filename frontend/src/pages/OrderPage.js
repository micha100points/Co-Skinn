import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { search, status, startDate, endDate } = filters;
      const response = await axios.get('http://localhost:5000/api/orders', {
        params: { search, status, startDate, endDate },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách đơn hàng
      </Typography>

      {/* Filter Section */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <TextField
          label="Tìm kiếm"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Tìm theo ID hoặc địa chỉ"
        />
        <TextField
          select
          label="Trạng thái"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="Pending">Chờ xử lý</MenuItem>
          <MenuItem value="Completed">Hoàn thành</MenuItem>
          <MenuItem value="Cancelled">Hủy bỏ</MenuItem>
        </TextField>
        <TextField
          type="date"
          label="Từ ngày"
          name="startDate"
          InputLabelProps={{ shrink: true }}
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <TextField
          type="date"
          label="Đến ngày"
          name="endDate"
          InputLabelProps={{ shrink: true }}
          value={filters.endDate}
          onChange={handleFilterChange}
        />
        <Button variant="contained" onClick={fetchOrders}>
          Lọc
        </Button>
      </Box>

      {/* Orders Table */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn hàng</TableCell>
                <TableCell>Địa chỉ giao hàng</TableCell>
                <TableCell>Ngày đặt hàng</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.ShippingAddress}</TableCell>
                  <TableCell>
                    {new Date(order.OrderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.Status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default OrderPage;
