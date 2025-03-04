import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{
        backgroundColor: '#fb6f92',
        justifyContent: "space-between",
        alignItems: "center",
        color: 'white',
        py: 4,
        mt: 4,
        width: "100%",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Cột thông tin */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Co-Skin Cosmetic
            </Typography>
            <Typography variant="body2">
              Địa chỉ: 123 Đường ABC, Quận XYZ, TP. HCM
            </Typography>
            <Typography variant="body2">
              Điện thoại: <Link href="tel:+84123456789" color="inherit" underline="hover">+84 123 456 789</Link>
            </Typography>
            <Typography variant="body2">
              Email: <Link href="mailto:support@coskin.vn" color="inherit" underline="hover">support@coskin.vn</Link>
            </Typography>
          </Grid>

          {/* Cột liên kết */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Liên kết nhanh
            </Typography>
            <Link href="/" color="inherit" underline="hover" sx={{ display: 'block', mb: 1 }}>
              Trang chủ
            </Link>
            <Link href="/about" color="inherit" underline="hover" sx={{ display: 'block', mb: 1 }}>
              Giới thiệu
            </Link>
            <Link href="/contact" color="inherit" underline="hover" sx={{ display: 'block', mb: 1 }}>
              Liên hệ
            </Link>
            <Link href="/privacy-policy" color="inherit" underline="hover" sx={{ display: 'block', mb: 1 }}>
              Chính sách bảo mật
            </Link>
          </Grid>

          {/* Cột mạng xã hội */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Theo dõi chúng tôi
            </Typography>
            <Typography variant="body2">
              <Link href="https://facebook.com/coskin" target="_blank" rel="noopener" color="inherit" underline="hover">
                Facebook
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="https://instagram.com/coskin" target="_blank" rel="noopener" color="inherit" underline="hover">
                Instagram
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="https://twitter.com/coskin" target="_blank" rel="noopener" color="inherit" underline="hover">
                Twitter
              </Link>
            </Typography>
          </Grid>
        </Grid>

        {/* Phần bản quyền */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Co-Skin Cosmetic. Tất cả các quyền được bảo lưu.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
