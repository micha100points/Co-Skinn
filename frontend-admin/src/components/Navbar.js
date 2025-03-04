import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar
      position="fixed"
      sx={{ backgroundColor: "#fb6f92", zIndex: 1000, top: 0, left: 0 }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-around",
          color: "white",
        }}
      >
        <Button color="inherit" component={Link} to="/admin/management">
          Co-Skin
        </Button>
        <Button color="inherit" component={Link} to="/products">
          Quản lý Sản phẩm
        </Button>
        <Button color="inherit" component={Link} to="/categories">
          Quản lý Danh mục
        </Button>
        <Button color="inherit" component={Link} to="/orders">
          Quản lý Đơn Hàng
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
