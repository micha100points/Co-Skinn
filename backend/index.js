const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors
const userRoutes = require('./routes/UserRoutes.js');
const productRoutes = require('./routes/ProductRoutes.js');
const categoryRoutes = require('./routes/CategoryRoutes.js');
const cartRoutes = require('./routes/CartRoutes.js');
const vnpay = require('./routes/VNPay.js')
const orderRoutes = require('./routes/OrderRoutes.js');



// Nạp biến môi trường từ file .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Kết nối với MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('Kết nối MongoDB thành công'))
.catch(err => console.error('Kết nối MongoDB thất bại:', err));

// Middleware để xử lý JSON
app.use(express.json());

// Sử dụng middleware cors
app.use(cors()); // Kích hoạt cors cho tất cả các yêu cầu

app.use('${api}/vnpay', vnpay)
// Route 
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/vnpay", vnpay);
// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
