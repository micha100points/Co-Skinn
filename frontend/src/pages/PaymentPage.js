import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaymentPage.css";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null); // Khởi tạo cart là null
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // Thông báo thanh toán
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [language, setLanguage] = useState("vn");
  const userId = localStorage.getItem("userId");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    // Nếu có giỏ hàng từ state, dùng nó. Nếu không, truy vấn lại API
    if (location.state?.cart) {
      setCart(location.state.cart);
    } else if (userId) {
      axios
        .get(`http://localhost:5000/api/carts/${userId}`)
        .then((response) => {
          setCart(response.data);
        })
        .catch((error) => {
          console.error("Error fetching cart:", error);
        });
    }
  }, [location.state, userId]);

  // Xử lý kết quả thanh toán khi quay lại từ VNPay
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const vnpResponseCode = queryParams.get("vnp_ResponseCode");
    const vnpTxnRef = queryParams.get("vnp_TxnRef");

    // Lấy orderId từ query string hoặc từ state nếu có
    const orderIdFromQuery = queryParams.get("orderId") || orderId;
    setOrderId(orderIdFromQuery); // Cập nhật orderId từ query string nếu có

    if (vnpResponseCode && vnpTxnRef) {
      // Gửi yêu cầu GET để kiểm tra kết quả thanh toán từ backend
      axios
        .get("http://localhost:5000/api/vnpay/vnpay_return", {
          params: {
            vnp_ResponseCode: vnpResponseCode,
            vnp_TxnRef: vnpTxnRef,
          },
        })
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            // Cập nhật trạng thái đơn hàng nếu thanh toán thành công
            axios
              .put(
                `http://localhost:5000/api/orders/update-status/${orderId}`,
                {
                  Status: "Đã thanh toán",
                }
              )
              .then(() => {
                toast.success("Bạn đã thanh toán thành công.");
                navigate("/");
              })
              .catch((error) => {
                setPaymentStatus({
                  type: "error",
                  message: "Lỗi khi cập nhật trạng thái đơn hàng.",
                });
                console.error("Error updating order status:", error);
              });
          } else {
            // Cập nhật trạng thái đơn hàng nếu thanh toán thất bại
            axios
              .put(
                `http://localhost:5000/api/orders/update-status/${orderId}`,
                {
                  Status: "Thanh toán thất bại",
                }
              )
              .then(() => {
                setPaymentStatus({
                  type: "error",
                  message:
                    response.data.message ||
                    "Thanh toán thất bại. Vui lòng thử lại.",
                });
              })
              .catch((error) => {
                setPaymentStatus({
                  type: "error",
                  message: "Lỗi khi cập nhật trạng thái đơn hàng.",
                });
                console.error("Error updating order status:", error);
              });
          }
        })
        .catch((error) => {
          setPaymentStatus({
            type: "error",
            message: "Lỗi khi kiểm tra thanh toán.",
          });
          console.error("Error verifying payment:", error);
        });
    }
  }, [orderId]); // Chạy lại khi orderId thay đổi

  if (!cart || cart.Products.length === 0) {
    return <div>Giỏ hàng không hợp lệ hoặc không có sản phẩm.</div>;
  }

  const totalMoney = () =>
    cart.Products.reduce(
      (total, product) => total + product.Price * product.Quantity,
      0
    );

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const total = totalMoney();

      if (!total || total <= 0) {
        alert("Giỏ hàng không hợp lệ.");
        return;
      }

      if (!selectedBankCode) {
        alert("Vui lòng chọn phương thức thanh toán.");
        return;
      }

      const userId = parseInt(localStorage.getItem("userId"));
      const userResponse = await axios.get(
        `http://localhost:5000/api/users/getUser/${userId}`
      );

      if (userResponse.status !== 200) {
        alert("Không tìm được người dùng.");
        return;
      }

      const shippingAddress = userResponse.data.Address;
      const paymentMethod = "Online Payment";

      const createOrderResponse = await axios.post(
        "http://localhost:5000/api/orders/create",
        {
          UserID: userId,
          TotalAmount: total,
          ShippingAddress: shippingAddress,
          PaymentMethod: paymentMethod,
        }
      );

      if (createOrderResponse.status !== 201) {
        alert("Không tạo được đơn hàng");
        return;
      }

      setOrderId(createOrderResponse.data._id);

      const response = await axios.post(
        "http://localhost:5000/api/vnpay/create_payment_url",
        {
          amount: total,
          bankCode: selectedBankCode,
          language,
        }
      );

      if (response.status === 200 && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        alert("Không thể tạo URL thanh toán. Vui lòng thử lại.");
      }
    } catch (err) {
      alert("Lỗi khi thực hiện thanh toán.");
      console.error("Error during checkout:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container" style={{ mt: "800px" }}>
      <h1>Thanh toán</h1>

      {/* Hiển thị thông báo thanh toán */}
      {paymentStatus && (
        <div
          className={`payment-status ${
            paymentStatus.type === "success" ? "success" : "error"
          }`}
        >
          <p>{paymentStatus.message}</p>
        </div>
      )}

      <div>
        <Typography variant="h6" gutterBottom style={{ fontWeight: 700 }}>
          Thông tin đơn hàng
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: "center", fontWeight: 700 }}>
                  Sản phẩm
                </TableCell>
                <TableCell style={{ textAlign: "center", fontWeight: 700 }}>
                  Số lượng
                </TableCell>
                <TableCell style={{ textAlign: "center", fontWeight: 700 }}>
                  Giá
                </TableCell>
                <TableCell style={{ textAlign: "center", fontWeight: 700 }}>
                  Thành tiền
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.Products.map((product) => (
                <TableRow key={product.ProductID}>
                  <TableCell align="left">{product.ProductName}</TableCell>
                  <TableCell align="center">{product.Quantity}</TableCell>
                  <TableCell align="center">
                    {product.Price.toLocaleString()} VND
                  </TableCell>
                  <TableCell align="right">
                    {(product.Price * product.Quantity).toLocaleString()} VND
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography
          variant="h6"
          align="right"
          marginTop={1}
          style={{ fontWeight: 700 }}
        >
          Tổng cộng: {totalMoney().toLocaleString()} VND
        </Typography>
      </div>

      <div>
        <FormControl>
          <FormLabel id="payment-options-label" style={{ marginBottom: 5 }}>
            Chọn phương thức thanh toán:
          </FormLabel>
          <RadioGroup
            aria-labelledby="payment-options-label"
            name="bankCode"
            value={selectedBankCode}
            onChange={(e) => setSelectedBankCode(e.target.value)}
          >
            <FormControlLabel
              value=""
              control={<Radio />}
              label="Cổng thanh toán VNPAYQR"
            />
            <FormControlLabel
              value="VNPAYQR"
              control={<Radio />}
              label="Thanh toán qua ứng dụng hỗ trợ VNPAYQR"
            />
            <FormControlLabel
              value="VNBANK"
              control={<Radio />}
              label="Thanh toán qua ATM"
            />
            <FormControlLabel
              value="INTCARD"
              control={<Radio />}
              label="Thanh toán qua thẻ quốc tế"
            />
          </RadioGroup>
        </FormControl>
      </div>

      <div className="payment-buttons">
        <Button
          onClick={handleCheckout}
          disabled={loading}
          className="checkout-btn"
        >
          {loading ? "Đang xử lý..." : "Thanh toán"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;
