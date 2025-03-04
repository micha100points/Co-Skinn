import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Container,
  Box,
  Divider,
  TextField,
  Button,
  IconButton,
  Rating,
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ProductActions from "./ProductAction";

function ProductDetail({ setCartCount }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    userName: "",
    comment: "",
    rating: 0,
  });

  // Dữ liệu đánh giá ảo cho từng sản phẩm
  const fakeReviewsData = {
    1: [
      // Sản phẩm có ID là 1
      {
        _id: "1",
        userName: "Trà My",
        comment: "Sản phẩm rất tốt!",
        rating: 5,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "2",
        userName: "Trúc Mai",
        comment: "Đóng gói đẹp, giao hàng nhanh.",
        rating: 4,
        createdAt: new Date().toISOString(),
      },
    ],
    2: [
      // Sản phẩm có ID là 2
      {
        _id: "3",
        userName: "Lê Uyên",
        comment: "Chất lượng tuyệt vời!",
        rating: 5,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "4",
        userName: "Thu Nhàn",
        comment: "Giá hợp lý, sử dụng rất tốt.",
        rating: 4,
        createdAt: new Date().toISOString(),
      },
    ],
    3: [
      {
        _id: "5",
        userName: "Bích Châu",
        comment: "Sản phẩm có thể cải thiện chất lượng.",
        rating: 3,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "6",
        userName: "Anh Vũ",
        comment: "Tốt nhưng giá hơi cao.",
        rating: 4,
        createdAt: new Date().toISOString(),
      },
    ],
    4: [
      {
        _id: "7",
        userName: "Minh Thông",
        comment: "Rất hài lòng, sản phẩm đúng như mô tả!",
        rating: 5,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "8",
        userName: "Thanh Nhã",
        comment: "Sản phẩm khá ổn, nhưng giao hàng hơi lâu.",
        rating: 4,
        createdAt: new Date().toISOString(),
      },
    ],
    5: [
      {
        _id: "9",
        userName: "Lê Quốc Đạt",
        comment: "Chất lượng xứng đáng với giá tiền!",
        rating: 5,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "10",
        userName: "Phan Thị Kim",
        comment: "Không vừa ý, sản phẩm không đúng mô tả.",
        rating: 2,
        createdAt: new Date().toISOString(),
      },
    ],
    6: [
      {
        _id: "11",
        userName: "Nguyễn Thị Linh",
        comment: "Giá rẻ, chất lượng ổn định!",
        rating: 4,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "12",
        userName: "Đoàn Minh Mạng",
        comment: "Không có gì đặc biệt, sản phẩm dùng tạm được.",
        rating: 3,
        createdAt: new Date().toISOString(),
      },
    ],
    7: [
      {
        _id: "13",
        userName: "Vũ Thị Nương",
        comment: "Rất thích sản phẩm này, sẽ mua lại!",
        rating: 5,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "14",
        userName: "Đoàn Thị Hương",
        comment: "Giao hàng nhanh, sản phẩm tốt.",
        rating: 4,
        createdAt: new Date().toISOString(),
      },
    ],
    8: [
      {
        _id: "15",
        userName: "Nguyễn Minh Phucs",
        comment: "Sản phẩm tuyệt vời, đáng đồng tiền.",
        rating: 5,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "16",
        userName: "Trương Quốc Dũng",
        comment: "Giá hơi cao nhưng chất lượng tốt.",
        rating: 4,
        createdAt: new Date().toISOString(),
      },
    ],
    9: [
      {
        _id: "17",
        userName: "Lê Thị Anh",
        comment: "Mình rất thích sản phẩm này!",
        rating: 5,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "18",
        userName: "Bùi Minh Sĩ",
        comment: "Chất lượng tạm ổn, không có gì nổi bật.",
        rating: 3,
        createdAt: new Date().toISOString(),
      },
    ],
    10: [
      {
        _id: "19",
        userName: "Nguyễn Quốc Tâm",
        comment: "Dịch vụ tốt, sản phẩm tốt!",
        rating: 5,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "20",
        userName: "Trần Minh",
        comment: "Không đúng với mô tả, cần cải thiện.",
        rating: 2,
        createdAt: new Date().toISOString(),
      },
    ],
    12: [
      {
        _id: "21",
        userName: "Lê Minh Vũ",
        comment: "Mua 1 lần, chất lượng vượt trội!",
        rating: 5,
        createdAt: new Date().toISOString(),
      },
      {
        _id: "22",
        userName: "Nguyễn Minh Tiến",
        comment: "Hài lòng với chất lượng sản phẩm, sẽ mua lại.",
        rating: 4,
        createdAt: new Date().toISOString(),
      },
    ],
  };

  // Fetch product details
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error("Error fetching product detail:", error));
  }, [id]);

  const [similarProducts, setSimilarProducts] = useState([]);

  // Tải dữ liệu đánh giá từ API và kết hợp với đánh giá ảo
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/reviews/${id}`)
      .then((response) => {
        const fakeReviews = fakeReviewsData[id] || [];
        setReviews([...fakeReviews, ...response.data]); // Kết hợp đánh giá thật và ảo
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setReviews(fakeReviewsData[id] || []); // Hiển thị dữ liệu giả nếu lỗi
      });
    // Tải sản phẩm tương tự từ API
    console.log("Product ID:", id); // Kiểm tra xem id có đúng không
    axios
      .get(`http://localhost:5000/api/products/similar/${id}`)
      .then((response) => {
        console.log("Similar Products:", response.data); // Thêm dòng này
        setSimilarProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching similar products:", error);
        setSimilarProducts([]); // Đảm bảo trạng thái không bị undefined nếu lỗi
      });
  }, [id]);

  useEffect(() => {
    if (product) {
      axios
        .get(`http://localhost:5000/api/products/similar/${product.Category}`) // Ví dụ: Dựa trên Category
        .then((response) => setSimilarProducts(response.data))
        .catch((error) =>
          console.error("Lỗi khi lấy sản phẩm tương tự:", error)
        );
    }
  }, [product]);

  // Xử lý gửi đánh giá
  const handleReviewSubmit = () => {
    if (!newReview.userName || !newReview.comment || newReview.rating === 0) {
      alert("Vui lòng điền đầy đủ thông tin trước khi gửi.");
      return;
    }

    const newFakeReview = {
      _id: new Date().getTime().toString(),
      ...newReview,
      createdAt: new Date().toISOString(),
    };

    setReviews([newFakeReview, ...reviews]); // Thêm review vào danh sách
    setNewReview({ userName: "", comment: "", rating: 0 }); // Reset form
  };

  // State and Handler Functions
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  const handleBuyNow = (product) => {
    console.log("Mua ngay:", product);
    // Xử lý chuyển đến trang thanh toán hoặc các bước tiếp theo
  };

  if (!product) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="lg" style={{ marginTop: 100 }}>
      {/* Thông tin sản phẩm */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        boxShadow={3}
        padding="40px"
        borderRadius="8px"
        bgcolor="#fff"
      >
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <img
            src={product.ImageURL}
            alt={product.ProductName}
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "8px",
              objectFit: "cover",
              maxHeight: "300px",
              objectPosition: "center",
            }}
          />
        </Box>

        <Box flex={2} padding={{ xs: "10px", md: "2px" }}>
          <Typography
            variant="h4"
            gutterBottom
            style={{ fontWeight: "bold", color: "#333" }}
          >
            {product.ProductName}
          </Typography>
          <Divider style={{ margin: "10px 0" }} />
          <Typography variant="h6" color="primary" gutterBottom>
            Giá: {product.Price.toLocaleString("vi-VN")} VND
          </Typography>
          <Divider style={{ margin: "10px 0" }} />
          <Typography variant="body1" color="text.secondary" paragraph>
            {product.Description}
          </Typography>
          <ProductActions product={product} setCartCount={setCartCount} />
        </Box>
      </Box>

      {/* Phần sp tương tự */}
      <Box marginTop="50px" position="relative">
        <Typography variant="h5" gutterBottom>
          Sản phẩm tương tự
        </Typography>

        {/* Navigation buttons */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            zIndex: 10,
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        >
          <IconButton
            sx={{
              pointerEvents: "auto",
              backgroundColor: "rgba(255,255,255,0.7)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.9)",
              },
            }}
            onClick={() => {
              if (currentProductIndex > 0) {
                setCurrentProductIndex(currentProductIndex - 1);
              }
            }}
            disabled={currentProductIndex === 0}
          >
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton
            sx={{
              pointerEvents: "auto",
              backgroundColor: "rgba(255,255,255,0.7)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.9)",
              },
            }}
            onClick={() => {
              if (currentProductIndex + 3 < similarProducts.length) {
                setCurrentProductIndex(currentProductIndex + 1);
              }
            }}
            disabled={currentProductIndex + 3 >= similarProducts.length}
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>

        {/* Product display area */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap="20px" // Khoảng cách giữa các sản phẩm
          marginTop="20px"
        >
          {similarProducts.length > 0 ? (
            similarProducts
              .slice(currentProductIndex, currentProductIndex + 3)
              .map((product, index) => (
                <Box
                  key={index}
                  display="flex"
                  flexDirection="column"
                  boxShadow={2}
                  padding="15px"
                  borderRadius="8px"
                  bgcolor="#ffffff"
                  width="300px" // Kích thước cố định cho từng sản phẩm
                >
                  <img
                    src={product.ImageURL}
                    alt={product.ProductName}
                    style={{
                      width: "100%",
                      height: "250px", // Chiều cao cố định
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <Typography
                    variant="h6"
                    style={{ fontWeight: "bold", marginTop: "10px" }}
                  >
                    {product.ProductName}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="primary"
                    style={{ marginTop: "5px" }}
                  >
                    {product.Price.toLocaleString("vi-VN")} VND
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ marginTop: "10px" }}
                    onClick={() => {
                      window.location.href = `/product/${product.ProductID}`;
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </Box>
              ))
          ) : (
            <Typography>Không có sản phẩm tương tự.</Typography>
          )}
        </Box>
      </Box>

      {/* Phần đánh giá và bình luận */}
      <Box marginTop="50px">
        <Typography variant="h5" gutterBottom>
          Đánh giá & Bình luận
        </Typography>

        {/* Form thêm đánh giá */}
        <Box
          display="flex"
          flexDirection="column"
          padding="20px"
          boxShadow={3}
          borderRadius="8px"
          bgcolor="#f5f5f5"
          marginBottom="20px"
        >
          <Typography variant="h6" style={{ marginBottom: "10px" }}>
            Thêm đánh giá của bạn
          </Typography>
          <TextField
            label="Tên của bạn"
            value={newReview.userName}
            onChange={(e) =>
              setNewReview({ ...newReview, userName: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Bình luận của bạn"
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            multiline
            rows={3}
            fullWidth
            margin="normal"
          />
          <Box display="flex" alignItems="center" margin="10px 0">
            <Typography style={{ marginRight: "10px" }}>Đánh giá:</Typography>
            <Rating
              value={newReview.rating}
              onChange={(e, newValue) =>
                setNewReview({ ...newReview, rating: newValue })
              }
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReviewSubmit}
            style={{ alignSelf: "flex-end", marginTop: "10px" }}
          >
            Gửi đánh giá
          </Button>
        </Box>

        {/* Danh sách đánh giá */}
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Box
              key={review._id}
              display="flex"
              flexDirection="column"
              boxShadow={2}
              padding="20px"
              borderRadius="8px"
              bgcolor="#ffffff"
              marginBottom="15px"
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" style={{ fontWeight: "bold" }}>
                  {review.userName}
                </Typography>
                <Rating value={review.rating} readOnly />
              </Box>
              <Typography
                variant="body1"
                style={{ marginTop: "10px", color: "#555" }}
              >
                {review.comment}
              </Typography>
              <Typography
                variant="caption"
                style={{
                  marginTop: "10px",
                  color: "#888",
                  fontStyle: "italic",
                }}
              >
                {new Date(review.createdAt).toLocaleString()}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography>
            Chưa có đánh giá. Hãy là người đầu tiên đánh giá!
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default ProductDetail;
