import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Badge,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import UserMenu from "./UserMenu";

function Navbar({ cartCount }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [filteredProducts, setFilteredProducts] = useState([]); // Danh sách đã lọc
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [username, setUserName] = useState(""); // Lưu tên người dùng
  const navigate = useNavigate();
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    console.log()
    if (storedUsername) {
      setUserName(storedUsername); // Lấy tên người dùng từ localStorage
    }

    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setProducts(response.data);
          setFilteredProducts(response.data);
        } else {
          console.warn("Dữ liệu không hợp lệ:", response.data);
        }
      })
      .catch((error) => console.error("Lỗi khi lấy sản phẩm:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      console.log("Không nhập từ khóa, hiển thị tất cả sản phẩm:", products);
      return;
    }

    const filtered = products.filter((product) => {
      const name = product.ProductName?.toLowerCase() || "";
      const description = product.Description?.toLowerCase() || "";
      return (
        name.includes(searchTerm.toLowerCase()) ||
        description.includes(searchTerm.toLowerCase())
      );
    });

    console.log("Từ khóa:", searchTerm);
    console.log("Sản phẩm tìm thấy:", filtered);

    setFilteredProducts(filtered);
    navigate("/search-products", { state: { filteredProducts: filtered } });
  };

  return (
    <>
      {/* Navbar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#fb6f92",
          zIndex: 1000,
          top: 0,
          left: 0,
          width: "100%",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 1%",
            color: "#ffe5ec",
          }}
        >
          {/* Menu */}
          <Box sx={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <Button color="inherit" component={Link} to="/">
              Trang chủ
            </Button>
            <Button color="inherit" component={Link} to="/categories">
              Danh Mục
            </Button>
            <Button color="inherit" component={Link} to="/products">
              Sản Phẩm
            </Button>
          </Box>

          {/* Thanh tìm kiếm */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#fff",
              borderRadius: "25px",
              overflow: "hidden",
              width: { xs: "80%", sm: "50%", md: "40%" },
            }}
          >
            <TextField
              variant="standard"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#C71585", marginLeft: "10px" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                padding: "5px 10px",
                "& input": {
                  padding: "8px",
                  fontSize: "14px",
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                backgroundColor: "#ff8fab",
                color: "#fff",
                borderRadius: 0,
                padding: "11px 20px",
                "&:hover": {
                  backgroundColor: "#ff85a3",
                },
              }}
            >
              Tìm kiếm
            </Button>
          </Box>

          {/* Giỏ hàng và người dùng */}
          <Box sx={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <IconButton color="inherit" component={Link} to="/cart">
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* Hiển thị icon hình tròn và tên người dùng nếu có */}
            <UserMenu username={username} />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
