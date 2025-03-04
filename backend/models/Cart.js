// models/Cart.js
const mongoose = require('mongoose');
const Product = require('./Product');

const cartSchema = new mongoose.Schema({
    UserID: {
        type: mongoose.Schema.Types.Number,
        ref: 'User',
        required: true
    },
    Products: [
        {
            ProductID: {
                type: mongoose.Schema.Types.Number,
                ref: 'Product',
                required: true
            },
            ProductName: {
                type: String,
                required: false
            },
            Quantity: {
                type: Number,
                required: true,
                min: 1 // đảm bảo số lượng sản phẩm ít nhất là 1
            },
            Price: {
                type: Number,
                required: true // Giá tại thời điểm thêm sản phẩm vào giỏ
            }
        }
    ],
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    UpdatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware tự động cập nhật `UpdatedAt` khi có thay đổi
cartSchema.pre('save', function (next) {
    this.UpdatedAt = Date.now();
    next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
