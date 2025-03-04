import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';  // Để lấy 'id' từ URL
import { Grid, Paper, Typography } from '@mui/material';

function CategoryProductsPage() {
  const { id } = useParams();  // Lấy categoryId từ URL
  console.log('Category ID:', id);
  const [products, setProducts] = useState([]);

  // Hàm useEffect để gọi API và lấy sản phẩm theo categoryId
  useEffect(() => {
    console.log(`Category ID từ URL: ${id}`);  // Kiểm tra giá trị của id
    if (!id) {
      console.error('ID không hợp lệ!');
      return;  
    }
    axios.get(`http://localhost:5000/api/products/category/${id}`)
      .then(response => {
        console.log("Sản phẩm trả về:", response.data);  
        setProducts(response.data); 
      })
      .catch(error => {
        console.error('Lỗi khi lấy sản phẩm:', error);
        if (error.response) {
          console.error('Lỗi từ server:', error.response.data);  // Log chi tiết lỗi từ server
        } else {
          console.error('Lỗi khác:', error.message);  // Lỗi mạng hoặc các lỗi khác
        }
      });
  }, [id]);  // useEffect sẽ chạy lại mỗi khi `id` thay đổi

  return (
    <div style={{ padding: '20px', marginTop: '20px' }}>
      <Typography
        variant="h3"
        sx={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#FC9BB2',
          fontWeight: '700',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}
      >
        Sản phẩm của danh mục
      </Typography>

      {/* Nếu có sản phẩm, hiển thị chúng */}
      <Grid container spacing={4} justifyContent="center">
        {products.length > 0 ? (
          products.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Paper
                elevation={3}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px',
                  textAlign: 'center',
                  backgroundColor: '#FFFAF0',
                  borderRadius: '10px',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    backgroundColor: '#FFF0F5',
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF6F61' }}>
                  {product.ProductName}
                </Typography>
                <p>{product.Description}</p>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography variant="h5" sx={{ textAlign: 'center', marginTop: '20px' }}>
            Không có sản phẩm nào trong danh mục này.
          </Typography>
        )}
      </Grid>
    </div>
  );
}
export default CategoryProductsPage;