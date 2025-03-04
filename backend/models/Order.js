const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    OrderID: {
        type: mongoose.Schema.Types.Number,
        auto: true,
        required: false
    },
    UserID: {
        type: mongoose.Schema.Types.Number,
        ref: 'User',
        required: true
    },
    TotalAmount: {
        type: Number,
        required: true
    },
    OrderDate: {
        type: Date,
        default: Date.now
    },
    Status: {
        type: String,
        enum: ['Chờ thanh toán', 'Đã thanh toán', 'Thanh toán thất bại','Chờ giao hàng', 'Đang giao hàng', 'Giao hàng thành công', 'Giao hàng thất bại'],
        default: 'Đã thanh toán'
    },
    ShippingAddress: {
        type: String,
        required: true
    },
    PaymentMethod: {
        type: String,
        enum: ['Online Payment'],
        required: true
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
